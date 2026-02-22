import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.1"
import { VertexAI } from "npm:@google-cloud/vertexai"

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
        const { messages } = body

        // Check if messages is provided
        if (!messages || !Array.isArray(messages)) {
            throw new Error('Thiếu lịch sử tin nhắn (messages)')
        }

        // Lấy thông tin dự án GCP từ biến môi trường
        // Project ID của Google Cloud Project có bật Vertex AI API
        const projectId = Deno.env.get('GOOGLE_CLOUD_PROJECT_ID')
        if (!projectId) {
            throw new Error('Thiếu cấu hình GOOGLE_CLOUD_PROJECT_ID trong biến môi trường Supabase')
        }

        const location = Deno.env.get('GOOGLE_CLOUD_LOCATION') || 'us-central1'

        // Lấy và parse Service Account JSON từ biến môi trường
        const credentialsText = Deno.env.get('GOOGLE_APPLICATION_CREDENTIALS')
        if (!credentialsText) {
            throw new Error('Thiếu cấu hình GOOGLE_APPLICATION_CREDENTIALS trong biến môi trường Supabase')
        }

        let credentials;
        try {
            credentials = JSON.parse(credentialsText)
        } catch (e: any) {
            throw new Error('GOOGLE_APPLICATION_CREDENTIALS không phải là JSON hợp lệ: ' + e.message)
        }

        // Khởi tạo Vertex AI Client với thông tin xác thực trực tiếp
        // Ở môi trường Deno của Supabase, SDK VertexAI sẽ bị lỗi nếu coi GOOGLE_APPLICATION_CREDENTIALS là file path.
        const vertexAI = new VertexAI({
            project: projectId,
            location: location,
            googleAuthOptions: {
                credentials: {
                    client_email: credentials.client_email,
                    private_key: credentials.private_key, // private_key trong JSON chứa các ký tự \n xuống dòng
                }
            }
        })

        // Dùng gemini-2.5-pro theo yêu cầu
        const generativeModel = vertexAI.getGenerativeModel({
            model: "gemini-2.5-pro",
            systemInstruction: `1. VAI TRÒ VÀ PHONG CÁCH (ROLE & PERSONA)
Danh tính: Bạn là chuyên viên tư vấn cao cấp của Huge Agency, một đơn vị có 5 năm kinh nghiệm trong lĩnh vực Web, Marketing và Branding.
Xưng hô: Sử dụng đại từ "Em" và gọi khách hàng là "Anh/Chị".
Phong cách: Chuyên nghiệp, nhiệt tình, cầu thị. Sử dụng các từ ngữ như "Dạ", "Vâng ạ" để tạo thiện cảm.

2. NGUYÊN TẮC DỮ LIỆU (STRICT GROUNDING)
Nguồn duy nhất: Chỉ sử dụng thông tin từ Data Store được đính kèm (hồ sơ, báo giá trong file đính kèm). Tuyệt đối KHÔNG sử dụng kiến thức bên ngoài để tự bịa ra con số hoặc gói dịch vụ.
Xử lý khi thiếu thông tin: Nếu khách hỏi dịch vụ/giá không có trong tài liệu, hãy trả lời: "Dạ, hiện tại yêu cầu này cần tư vấn chuyên sâu hơn. Anh/Chị cho em xin SĐT để chuyên viên bên em tính toán và báo lại chính xác theo nhu cầu riêng của mình nhé."

3. QUY TẮC PHẢN HỒI TỨC THÌ (EFFICIENCY)
Không trì hoãn: Thực hiện tra cứu và đưa ra kết quả ngay lập tức trong cùng một lượt chat.
Tuyệt đối cấm: Không được nói "đợi em một chút", "em xin phép kiểm tra" rồi dừng lại. Phải nhả kết quả (giá, tính năng) ra ngay.

4. LUỒNG HỘI THOẠI VÀ MỤC TIÊU CHỐT SALE (CONVERSATION FLOW)
Bước 1: Chào hỏi & Khai thác nhu cầu: Chào khách và hỏi xem họ đang cần hỗ trợ mảng nào (Web, SEO, Marketing hay Branding?).
Bước 2: Tư vấn & Báo giá: Trích xuất chi tiết các gói giá (Tên gói - Mức giá - Tính năng nổi bật) từ tài liệu. Nhắc đến kinh nghiệm 5 năm và các dự án tiêu biểu (ví dụ: Wafaifo, KYOTO Sushi) để tăng uy tín.
Bước 3: Chốt Sale & Lấy thông tin: * Chỉ xin thông tin liên lạc (Họ tên, SĐT) khi khách đã nắm được giá và thể hiện sự quan tâm sâu (muốn đặt lịch hẹn, muốn gặp trực tiếp, hoặc cần bản demo chi tiết).
Câu chốt: "Để em sắp xếp lịch hẹn/cuộc gọi với chuyên viên tư vấn nhằm tối ưu phương án và chi phí nhất cho dự án của mình, Anh/Chị cho em xin Họ tên và Số điện thoại nhé!"

5. LƯU Ý QUAN TRỌNG: Ngay khi khách hàng cung cấp Tên và Số điện thoại, HÃY GỌI HÀM save_customer_info(name, phone) MỘT LẦN DUY NHẤT để lưu vào hệ thống.`,
            tools: [{
                functionDeclarations: [{
                    name: "save_customer_info",
                    description: "Lưu trữ thông tin liên hệ của khách hàng. Gọi hàm này NGAY LẬP TỨC khi phát hiện khách hàng đã cung cấp Tên và Số điện thoại.",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "Tên của khách hàng" },
                            phone: { type: "string", description: "Số điện thoại của khách hàng" },
                        },
                        required: ["name", "phone"],
                    },
                }],
            }],
        })

        // Xử lý lịch sử chat để đưa vào format của Vertex AI (user vs model)
        // LƯU Ý Vertex AI yêu cầu tin nhắn ĐẦU TIÊN trong history bắt buộc phải từ 'user'
        let chatHistory = messages.slice(0, -1).map((m: any) => ({
            role: m.role === 'user' ? 'user' : 'model',
            parts: [{ text: m.content || '' }],
        }))

        // Lọc bỏ các tin nhắn 'model' ở đầu mảng (ví dụ câu chào mừng ban đầu)
        while (chatHistory.length > 0 && chatHistory[0].role === 'model') {
            chatHistory.shift()
        }

        const chat = generativeModel.startChat({ history: chatHistory })
        const latestMessage = messages[messages.length - 1].content

        // Danh sách GCS URIs chứa file PDF. 
        // Phải đảm bảo Service Account (trong biến GOOGLE_APPLICATION_CREDENTIALS) có quyền "Storage Object Viewer"
        const dataUris = [
            { uri: 'gs://hugsagencydn/Báo giá_Marketing tổng thể.pdf', mimeType: 'application/pdf' },
            { uri: 'gs://hugsagencydn/Hugs Credentials updated 2022.pdf', mimeType: 'application/pdf' },
            { uri: 'gs://hugsagencydn/website.pdf', mimeType: 'application/pdf' },
            { uri: 'gs://hugsagencydn/Credential Update 2024.pdf', mimeType: 'application/pdf' }
        ]

        const fileParts = dataUris.map(item => ({
            fileData: {
                mimeType: item.mimeType,
                fileUri: item.uri
            }
        }))

        // Gửi cả Text User vừa nhập và File Context
        const requestParts = [...fileParts, { text: latestMessage }]

        const result = await chat.sendMessageStream(requestParts)
        const response = await result.response

        let responseText = ""

        if (response.candidates && response.candidates.length > 0 && response.candidates[0].content.parts.length > 0) {
            responseText = response.candidates[0].content.parts.map((p: any) => p.text || '').join('')
        }

        // Kiểm tra Function Call từ Vertex AI SDK Node.js
        const firstCandidate = response.candidates ? response.candidates[0] : null

        let call = null;
        if (firstCandidate && firstCandidate.content.parts) {
            for (const part of firstCandidate.content.parts) {
                if (part.functionCall) {
                    call = part.functionCall;
                    break;
                }
            }
        }

        if (call) {
            if (call.name === "save_customer_info") {
                const args = call.args as Record<string, any>;
                const name = args.name as string;
                const phone = args.phone as string;
                console.log(`Đã trích xuất thông tin khách hàng - Tên: ${name}, SĐT: ${phone}`)

                // Lưu vào Supabase
                const supabaseUrl = Deno.env.get('SUPABASE_URL')
                const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

                if (supabaseUrl && supabaseKey) {
                    const supabase = createClient(supabaseUrl, supabaseKey)
                    const { error } = await supabase.from('customer_leads').insert({
                        name,
                        phone,
                        message_history: messages,
                        status: 'new'
                    })

                    if (error) {
                        console.error("Lỗi khi lưu vào customer_leads:", error)
                    } else {
                        console.log("Lưu thông tin thành công vào bảng customer_leads.")
                    }
                } else {
                    console.error("Thiếu biến môi trường SUPABASE_URL hoặc SUPABASE_SERVICE_ROLE_KEY")
                }

                // Trả kết quả của hàm lại cho chat để nó tạo câu trả lời
                const functionResponseResult = await chat.sendMessage([{
                    functionResponse: {
                        name: "save_customer_info",
                        response: { name: "save_customer_info", content: { success: true, message: "Saved successfully" } }
                    }
                }])

                const frResponse = await functionResponseResult.response
                if (frResponse.candidates && frResponse.candidates.length > 0 && frResponse.candidates[0].content.parts.length > 0) {
                    responseText = frResponse.candidates[0].content.parts.map((p: any) => p.text || '').join('') || "Cảm ơn bạn. Thông tin của bạn đã được ghi nhận. Chuyên viên của Huge Agency sẽ sớm liên hệ trực tiếp cho bạn nhé!"
                }
            }
        }

        return new Response(
            JSON.stringify({ response: responseText || "Xin lỗi, Em chưa hiểu ý Anh/Chị lắm." }),
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
