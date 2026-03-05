import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1"
import { GoogleAuth } from "npm:google-auth-library@9.15.0"

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders })
    }

    try {
        const body = await req.json()
        const { messages, sessionId } = body

        if (!messages || !Array.isArray(messages) || messages.length === 0) {
            throw new Error('Thiếu lịch sử tin nhắn (messages)')
        }

        const projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT_ID')
        const location = Deno.env.get('GOOGLE_CLOUD_LOCATION') || 'global'
        const dataStoreId = Deno.env.get('DATA_STORE_ID')

        if (!projectId || !dataStoreId) {
            throw new Error('Thiếu cấu hình GOOGLE_CLOUD_PROJECT_ID hoặc DATA_STORE_ID trong Supabase Edge Secrets.')
        }

        const credentialsText = Deno.env.get('GOOGLE_APPLICATION_CREDENTIALS')
        if (!credentialsText) {
            throw new Error('Thiếu cấu hình GOOGLE_APPLICATION_CREDENTIALS')
        }

        let credentials;
        try {
            credentials = JSON.parse(credentialsText)
        } catch (e: any) {
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS không hợp lệ: ' + e.message)
        }

        // 1. Lấy Access Token bằng google-auth-library
        const auth = new GoogleAuth({
            credentials: {
                client_email: credentials.client_email,
                private_key: credentials.private_key, // Đảm bảo private_key có chứa \n không bị lỗi
            },
            scopes: ['https://www.googleapis.com/auth/cloud-platform'],
        });

        const client = await auth.getClient();
        const accessTokenResponse = await client.getAccessToken();
        const accessToken = accessTokenResponse.token;

        if (!accessToken) {
            throw new Error('Không thể lấy Access Token từ Google Auth');
        }

        // 2. Chuẩn bị tham số gọi Vertex AI Agent Builder (Discovery Engine API)
        const latestMessage = messages[messages.length - 1].content

        // --- TRÍCH XUẤT THÔNG TIN KHÁCH HÀNG TỪ TOÀN BỘ LỊCH SỬ CHAT ---
        // Quét tất cả tin nhắn của user (không phải bot) để tìm SĐT và Tên
        const phoneRegex = /(0[3|5|7|8|9])+([0-9]{8})\b/

        // Nhiều pattern tìm tên tiếng Việt:
        const namePatterns = [
            // "tên là X", "tên: X", "tên X"
            /(?:tên\s*(?:là|:)\s*|tên\s+)([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){0,5})/i,
            // "tôi là X", "mình là X", "em là X"
            /(?:tôi|mình|em)\s+(?:là|tên(?:\s+là)?)\s*:?\s*([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){0,5})/i,
            // "anh X", "chị X" — xưng hô + tên (loại trừ các từ phổ biến không phải tên)
            /(?:^|[,.\s])(?:anh|chị|Anh|Chị)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){0,3})(?:\s+(?:đây|nè|ạ|nhé|nha))?(?:\s*[,.!]|\s*$)/m,
            // "dạ anh X", "dạ chị X"
            /(?:dạ|vâng)\s+(?:anh|chị)\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){0,3})/i,
            // "mình tên X", "tôi tên X"
            /(?:tôi|mình)\s+tên\s+([A-ZÀ-Ỹ][a-zà-ỹ]+(?:\s+[A-ZÀ-Ỹ][a-zà-ỹ]+){0,5})/i,
        ]

        // Các từ tiếng Việt phổ biến KHÔNG phải tên (để loại trừ false positive)
        const notNameWords = ['cho', 'có', 'ơi', 'à', 'ạ', 'nhé', 'nha', 'muốn', 'cần', 'xem', 'vui', 'thấy', 'biết', 'nên', 'đang', 'sẽ', 'đã', 'được', 'không', 'cũng', 'thì', 'làm', 'hay', 'gì', 'với', 'này', 'đó', 'kia', 'như', 'mà', 'và', 'hoặc', 'nhưng', 'nếu', 'khi', 'thế', 'sao', 'bao', 'đâu']

        const tryExtractName = (text: string): string | null => {
            for (const pattern of namePatterns) {
                const match = text.match(pattern)
                if (match && match[1]) {
                    const name = match[1].trim()
                    // Bỏ qua nếu tên trùng với từ phổ biến
                    if (notNameWords.includes(name.toLowerCase())) continue
                    // Bỏ qua nếu tên quá ngắn (1 ký tự)
                    if (name.length < 2) continue
                    return name
                }
            }
            return null
        }

        let extractedPhone: string | null = null
        let extractedName: string | null = null

        // Quét TOÀN BỘ lịch sử chat (từ cũ đến mới) để tìm thông tin
        const userMessages = messages.filter((m: any) => m.role === 'user')
        for (const msg of userMessages) {
            const content = msg.content || ''

            // Tìm SĐT
            const phoneMatch = content.match(phoneRegex)
            if (phoneMatch) {
                extractedPhone = phoneMatch[0]
            }

            // Tìm Tên
            const name = tryExtractName(content)
            if (name) {
                extractedName = name
            }
        }

        const hasExtractedPhone = !!extractedPhone
        const hasExtractedName = !!extractedName

        // Lưu/Cập nhật vào DB nếu có BẤT KỲ thông tin nào (tên HOẶC SĐT)
        if (hasExtractedPhone || hasExtractedName) {
            const supabaseUrl = Deno.env.get('SUPABASE_URL')
            const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
            if (supabaseUrl && supabaseKey) {
                const supabase = createClient(supabaseUrl, supabaseKey)
                const currentSessionId = sessionId || 'unknown'

                // Tìm xem đã có lead với session này chưa
                const { data: existingLead } = await supabase
                    .from('customer_leads')
                    .select('id, name, phone')
                    .eq('session_id', currentSessionId)
                    .maybeSingle()

                if (existingLead) {
                    // CẬP NHẬT lead hiện có - chỉ update các trường mới có giá trị
                    const updateData: any = { message_history: messages }
                    if (extractedName && (!existingLead.name || existingLead.name === 'Khách hàng')) {
                        updateData.name = extractedName
                    }
                    if (extractedPhone && !existingLead.phone) {
                        updateData.phone = extractedPhone
                    }

                    const { error } = await supabase
                        .from('customer_leads')
                        .update(updateData)
                        .eq('id', existingLead.id)

                    if (error) {
                        console.error("Lỗi khi cập nhật customer_leads:", error)
                    } else {
                        console.log(`Đã cập nhật lead: name=${extractedName}, phone=${extractedPhone}`)
                    }
                } else {
                    // TẠO MỚI lead
                    const { error } = await supabase.from('customer_leads').insert({
                        name: extractedName || 'Khách hàng',
                        phone: extractedPhone,
                        message_history: messages,
                        session_id: currentSessionId,
                        status: 'new'
                    })
                    if (error) {
                        console.error("Lỗi khi tạo customer_leads:", error)
                    } else {
                        console.log(`Đã tạo lead mới: name=${extractedName}, phone=${extractedPhone}`)
                    }
                }
            }
        }

        // 3. Gọi Converse API
        // Truyền sessionId '-' để Google Cloud tạo cuộc hội thoại mới nếu chưa có
        const conversationId = sessionId || '-';
        // v1alpha đang hỗ trợ trả về summaryText dựa trên PDF grounding tốt nhất
        const endpoint = `https://${location}-discoveryengine.googleapis.com/v1alpha/projects/${projectId}/locations/${location}/collections/default_collection/dataStores/${dataStoreId}/conversations/${conversationId}:converse`

        // System Instruction / Persona
        const systemInstruction = `# VAI TRÒ VÀ PHONG CÁCH
- Danh tính: Bạn là chuyên viên tư vấn cao cấp tại Huge Agency (5 năm kinh nghiệm mảng Web, Marketing, Branding).
- Xưng hô & Thái độ: Dùng "Em" và gọi khách là "Anh/Chị". Giao tiếp chuyên nghiệp, nhiệt tình, thấu hiểu. Thỉnh thoảng đệm các từ "Dạ", "Vâng ạ" một cách tự nhiên, linh hoạt thay đổi cách diễn đạt để không bị rập khuôn hay nhàm chán giữa các lượt chat.

# QUẢN LÝ DỮ LIỆU & KIẾN THỨC (QUAN TRỌNG)
1. Dữ liệu Dịch vụ & Báo giá (Strict Grounding): CHỈ ĐƯỢC PHÉP sử dụng thông tin từ Data Store đính kèm để báo giá và nêu tính năng. TUYỆT ĐỐI KHÔNG tự bịa ra con số, tên gói hay hứa hẹn tính năng không có trong tài liệu. 
2. Kiến thức Ngành (Value-Add): ĐƯỢC PHÉP sử dụng kiến thức bên ngoài để chia sẻ thêm các thông tin bên lề, xu hướng mới về Marketing, Branding, hoặc Thiết kế khi khách hàng thắc mắc hoặc để dẫn dắt câu chuyện (Ví dụ: gợi ý về tầm quan trọng của UI/UX, xu hướng SEO mới). Tuy nhiên, thông tin này phải ngắn gọn, sát với nhu cầu và làm nền để tôn lên dịch vụ của Huge Agency.
3. Xử lý khi thiếu thông tin: Nếu khách hỏi yêu cầu phức tạp ngoài tài liệu, hãy đáp khéo: "Dạ, với yêu cầu đặc thù này, team em cần đánh giá chi tiết hơn để đưa ra phương án tối ưu nhất. Anh/Chị cho em xin SĐT/Zalo để chuyên viên bên em tính toán và tư vấn kỹ hơn nhé ạ."

# NGUYÊN TẮC PHẢN HỒI
- Nhanh chóng & Trực diện: Tra cứu Data Store và trả lời trọng tâm ngay lập tức. Tuyệt đối không dùng các cụm từ trì hoãn giả lập như "Đợi em một chút", "Em xin phép kiểm tra".
- Tự nhiên & Gợi mở: Không bê nguyên xi một bảng báo giá dài dòng vào một tin nhắn. Hãy tóm tắt gói dịch vụ phù hợp nhất, kèm theo một vài dự án tiêu biểu (như Wafaifo, KYOTO Sushi) một cách khéo léo để tăng uy tín, sau đó đặt câu hỏi ngược lại để khai thác thêm nhu cầu.

# KỊCH BẢN CHỐT SALE & LẤY LEAD
- Thời điểm vàng: Chỉ xin thông tin liên lạc (Họ tên, SĐT/Zalo) khi khách đã nhận được giá trị tư vấn (biết sơ bộ về giá/tính năng) và thể hiện sự quan tâm sâu (hỏi chi tiết hơn, muốn xem demo, hoặc yêu cầu phức tạp).
- Biến tấu câu chốt (Không lặp lại một mẫu duy nhất): Tùy ngữ cảnh, hãy dùng các câu linh hoạt như: "Để em gửi Anh/Chị xem bản demo chi tiết hơn qua Zalo nhé, Anh/Chị dùng số nào ạ?" hoặc "Để team em lên phương án tối ưu chi phí cho dự án mình, Anh/Chị cho em xin số điện thoại nhé."
- Xử lý khi có số điện thoại: Ngay khi khách hàng cung cấp Tên/SĐT, HÃY CẢM ƠN VÀ XÁC NHẬN hệ thống đã ghi nhận thông tin (Hệ thống ẩn sẽ tự động lưu data, bạn KHÔNG tự sinh code). 
Ví dụ: "Dạ em cảm ơn Anh/Chị, em đã lưu lại thông tin. Chuyên viên bên em sẽ liên hệ lại ngay để hỗ trợ mình ạ."`;

        const requestBody = {
            query: { input: latestMessage },
            summarySpec: {
                modelPromptSpec: {
                    preamble: systemInstruction
                }
            }
        }

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errRes = await response.text();
            throw new Error('Agent Builder API Error: ' + errRes);
        }

        const data = await response.json();

        // Data format trả về với Agent Builder
        let replyText = data.reply?.reply || data.reply?.summary?.summaryText || "";

        const fallbackPhrases = [
            "A summary could not be generated",
            "could not generate a summary",
            "I could not generate",
            "not find the answer",
            "Here are some search results"
        ];

        const isFallback = replyText === "" || fallbackPhrases.some(phrase => replyText.includes(phrase));

        // --- PHÂN LOẠI TIN NHẮN ĐỂ TRẢ LỜI THÔNG MINH ---
        const latestLower = latestMessage.toLowerCase().trim()

        // 1. Nhận diện lời chào
        const isGreeting = /^(hello|hi|hey|xin\s*chào|chào|alo|hê\s*lô|helu|helo|yo|chào\s*bạn|chào\s*em|chào\s*anh|chào\s*chị|good\s*morning|good\s*afternoon)[!.?\s]*$/i.test(latestLower)

        // 2. Nhận diện câu hỏi off-topic / spam
        const offTopicKeywords = [
            'chiến tranh', 'chính trị', 'tổng thống', 'quốc hội',
            'cổ phiếu', 'chứng khoán', 'bitcoin', 'crypto', 'tiền ảo', 'coin',
            'thời tiết', 'dự báo',
            'bóng đá', 'world cup', 'ngoại hạng', 'champions league',
            'game', 'anime', 'manga', 'phim', 'netflix',
            'công thức nấu', 'nấu ăn',
            'lịch sử', 'thế chiến',
            'thuốc', 'bệnh viện', 'triệu chứng',
            'tử vi', 'horoscope', 'bói',
            'chat gpt', 'openai', 'gemini ai'
        ]
        const isOffTopic = offTopicKeywords.some(kw => latestLower.includes(kw))

        // 3. Nhận diện cảm ơn / tạm biệt
        const isThankBye = /^(cảm\s*ơn|cám\s*ơn|thanks|thank\s*you|ok\s*cảm\s*ơn|tạm\s*biệt|bye|goodbye|hẹn\s*gặp)[!.?\s]*$/i.test(latestLower)

        if (isFallback) {
            if (isGreeting) {
                replyText = "Dạ chào Anh/Chị! 👋 Em là trợ lý tư vấn của Huge Agency ạ. Bên em chuyên về Marketing, Branding, thiết kế Website, quảng cáo đa kênh và nhiều giải pháp truyền thông khác. Anh/Chị đang quan tâm đến mảng nào để em tư vấn chi tiết ạ?"
            } else if (isThankBye) {
                replyText = "Dạ em cảm ơn Anh/Chị đã quan tâm! Nếu sau này cần hỗ trợ thêm về Marketing, Branding hay bất kỳ dịch vụ nào, Anh/Chị cứ nhắn lại cho em nhé. Chúc Anh/Chị một ngày tốt lành ạ! 😊"
            } else if (isOffTopic) {
                replyText = "Dạ Anh/Chị ơi, em chỉ được đào tạo để hỗ trợ tư vấn các dịch vụ của Huge Agency thôi ạ (Marketing, Branding, Website, SEO, quản trị Fanpage, TikTok...). Anh/Chị có muốn em giới thiệu về dịch vụ nào không ạ? 😊"
            } else if (hasExtractedPhone) {
                replyText = "Dạ em cảm ơn Anh/Chị, em đã lưu lại thông tin số điện thoại. Chuyên viên tư vấn của Huge Agency sẽ liên hệ lại ngay để hỗ trợ mình ạ!"
            } else {
                replyText = "Dạ, hiện tại thông tin này em chưa được đào tạo. Anh/chị có thể vui lòng để lại Số Điện Thoại để chuyên viên Huge Agency gọi lại tư vấn chi tiết không ạ?"
            }
        } else if (hasExtractedPhone) {
            // Nếu AI vẫn trả lời được (tự nó sinh ra response tốt) nhưng mình cũng đã lưu sđt
            if (!replyText.toLowerCase().includes('cảm ơn') && !replyText.toLowerCase().includes('lưu lại')) {
                replyText += "\n\n(Dạ em cũng đã ghi nhận số điện thoại của Anh/Chị vào hệ thống rồi, chuyên viên bên em sẽ sớm liên hệ ạ!)"
            }
        }

        // Lấy Session ID (mã cuộc hội thoại) do Google Cloud gen ra (YYY ở đuôi paths)
        let newSessionId = sessionId;
        if (data.conversation && data.conversation.name) {
            const parts = data.conversation.name.split('/');
            newSessionId = parts[parts.length - 1];
        }

        return new Response(
            JSON.stringify({
                response: replyText,
                sessionId: newSessionId
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    } catch (error: any) {
        console.error('Lỗi trong function vertex-chat:', error)
        return new Response(
            JSON.stringify({ error: error.message || 'Lỗi xử lý nội bộ' }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        )
    }
})
