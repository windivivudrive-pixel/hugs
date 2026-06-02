function extractFAQs(content) {
  const faqs = [];
  if (!content) return faqs;

  // H2-H4 tags containing "?" or "hỏi"/"câu hỏi"/"faq"
  const regex = /<(h[2-4])(?:\s+[^>]*)*>(.*?(?:\?|câu hỏi|hỏi|faq).*?)<\/\1>\s*([\s\S]*?)(?=(?:<h[2-4]|$))/gi;
  
  let match;
  while ((match = regex.exec(content)) !== null) {
    const questionText = match[2].replace(/<\/?[^>]+(>|$)/g, "").trim();
    const rawAnswer = match[3];
    let answerText = rawAnswer.replace(/<\/?[^>]+(>|$)/g, "").trim();
    
    // Clean table of contents
    answerText = answerText.replace(/Table of Contents\s*Toggle[\s\S]*?(?:Kết luận|Toggle)/gi, "").trim();
    
    // Clean up double spaces/newlines
    answerText = answerText.replace(/\s+/g, " ").trim();

    if (questionText && answerText && questionText.length > 5 && answerText.length > 10) {
      if (faqs.length < 5) {
        faqs.push({ question: questionText, answer: answerText });
      }
    }
  }

  return faqs;
}

const API_URL = 'https://admin.hugs.agency/wp-json/wp/v2';

async function test() {
  try {
    const res = await fetch(`${API_URL}/posts?per_page=5`);
    const posts = await res.json();
    console.log(`Fetched ${posts.length} posts successfully.`);
    posts.forEach((post, i) => {
      console.log(`\n--- Post ${i + 1}: ${post.title.rendered} (slug: ${post.slug}) ---`);
      const faqs = extractFAQs(post.content.rendered);
      if (faqs.length > 0) {
        console.log("Extracted FAQs:", JSON.stringify(faqs, null, 2));
      } else {
        console.log("No FAQs extracted from content.");
      }
    });
  } catch (err) {
    console.error("Error:", err);
  }
}

test();
