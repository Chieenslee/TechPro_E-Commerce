import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const NewsDetail = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);

  // Mock data for the article
  const article = {
    id: id || '1',
    title: 'NVIDIA RTX 5090 Ti: Kỷ nguyên mới của Deep Learning',
    category: 'Hardware',
    date: '12 May, 2026',
    author: 'Alex Mercer',
    readTime: '8 min read',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBtFhpF4GoQmle2w9L-li1IdML_SAgzoz4TGzKUPydLyxID7gSTTLOTBtFh8-5jew1GJbQYFYhd5_p14N8wWD1mcbEEqSjHMM5Gh2sy5Ubr4378ZOATdne1rtkG-ku0ZdcbhgyoFyKyJr7ljNdZLS0WE9JPEnymmH0tA9mLlhYysHRKjE9pnBbrEWrXwB_34UjRaPIf8QRDq0vZCxOGjjxGibT7bUY9wbKKcvuWHuYzdzdy3vDxpg0RtpERF_QhbM-Mq2D8HLz19smx',
    content: `
      Hôm nay, ngành công nghiệp phần cứng chứng kiến một bước nhảy vọt chưa từng có. Mẫu card đồ họa đầu bảng mới nhất không chỉ tăng cường sức mạnh xử lý thuần túy mà còn tích hợp các module AI chuyên dụng ngay trên lõi silicon.
      
      Kiến trúc mới cho phép băng thông bộ nhớ vượt ngưỡng 2TB/s, giải quyết hoàn toàn nút thắt cổ chai trong việc huấn luyện các mô hình ngôn ngữ lớn (LLMs). Theo các bài test nội bộ của TechPro, hiệu năng suy luận (inference) đã tăng 300% so với thế hệ trước.
      
      Điều này có ý nghĩa gì đối với các kỹ sư AI? Bạn không còn cần một cụm server khổng lồ để chạy các mô hình cỡ vừa. Việc nghiên cứu có thể được thực hiện ngay trên máy trạm cục bộ, đảm bảo bảo mật dữ liệu tuyệt đối và giảm thiểu chi phí đám mây.
    `
  };

  return (
    <main className="flex-grow w-full page-enter">
      {/* Hero Header */}
      <div className="w-full relative h-[400px] lg:h-[500px] flex items-end pb-xl border-b border-outline-variant/30 overflow-hidden group">
        <div className="absolute inset-0 bg-surface-container-lowest">
          <img 
            src={article.image} 
            alt={article.title} 
            className="w-full h-full object-cover opacity-40 group-hover:opacity-50 transition-opacity duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-surface via-surface/80 to-transparent"></div>
        </div>
        
        <div className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop w-full relative z-10 fade-in-up">
          <div className="flex items-center gap-sm mb-md">
            <span className="bg-primary/20 text-primary border border-primary/30 px-3 py-1 rounded-full font-label-sm uppercase tracking-widest text-[10px] backdrop-blur-sm shadow-[0_0_15px_rgba(185,199,228,0.2)]">
              {article.category}
            </span>
            <span className="text-on-surface-variant font-label-sm flex items-center gap-1">
              <span className="material-symbols-outlined text-[14px]">schedule</span> {article.readTime}
            </span>
          </div>
          <h1 className="font-headline-xl text-headline-lg-mobile md:text-headline-xl text-on-surface mb-md text-glow">{article.title}</h1>
          <div className="flex items-center justify-between border-t border-outline-variant/30 pt-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-surface-variant flex items-center justify-center border border-outline-variant">
                <span className="material-symbols-outlined text-on-surface-variant">person</span>
              </div>
              <div>
                <p className="font-label-md text-on-surface">{article.author}</p>
                <p className="font-label-sm text-on-surface-variant text-[12px]">{article.date}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={() => setIsLiked(!isLiked)} 
                className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all ${isLiked ? 'bg-error/10 border-error/30 text-error shadow-[0_0_10px_rgba(255,84,73,0.2)]' : 'bg-surface border-outline-variant text-on-surface-variant hover:text-error hover:border-error/50'}`}
              >
                <span className="material-symbols-outlined" style={{ fontVariationSettings: isLiked ? "'FILL' 1" : "'FILL' 0" }}>favorite</span>
              </button>
              <button className="w-10 h-10 rounded-full flex items-center justify-center bg-surface border border-outline-variant text-on-surface-variant hover:text-primary hover:border-primary/50 transition-all">
                <span className="material-symbols-outlined">share</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Body */}
      <div className="max-w-[1000px] mx-auto px-margin-mobile md:px-margin-desktop py-xl flex flex-col lg:flex-row gap-xl">
        <article className="flex-1 font-body-lg text-on-surface-variant leading-relaxed fade-in-up" style={{ animationDelay: '0.2s' }}>
          {article.content.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="mb-6">{paragraph}</p>
          ))}
          
          {/* Tech Spec Block */}
          <div className="my-lg p-md glass border border-[#00E5FF]/30 border-l-4 border-l-[#00E5FF] rounded-r-lg shadow-[0_0_20px_rgba(0,229,255,0.05)]">
            <h4 className="font-headline-sm text-[#00E5FF] mb-sm flex items-center gap-2">
              <span className="material-symbols-outlined">memory</span> 
              Core Specification Highlights
            </h4>
            <ul className="list-disc pl-5 space-y-2 text-on-surface">
              <li>Tensor Cores thế hệ 5 (Tăng 4x hiệu năng AI)</li>
              <li>Bộ nhớ HBM3e 48GB</li>
              <li>TDP tối đa 600W với hệ thống tản nhiệt chất lỏng khép kín</li>
            </ul>
          </div>
          
          <div className="flex gap-2 mt-xl pt-lg border-t border-outline-variant/30">
            <span className="font-label-sm text-on-surface-variant uppercase tracking-widest mt-2 mr-2">Tags:</span>
            {['GPU', 'Deep Learning', 'Hardware', 'NVIDIA'].map(tag => (
              <Link key={tag} to={`/news?tag=${tag}`} className="bg-surface-container border border-outline-variant/50 text-on-surface px-3 py-1 rounded hover:border-primary hover:text-primary transition-colors font-label-sm">
                #{tag}
              </Link>
            ))}
          </div>
        </article>

        {/* Sidebar */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-lg fade-in-up" style={{ animationDelay: '0.3s' }}>
          <div className="glass p-md rounded-xl border border-outline-variant/30 sticky top-24">
            <h3 className="font-headline-sm text-on-surface border-b border-outline-variant/30 pb-sm mb-md flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">feed</span>
              Tin tức liên quan
            </h3>
            <div className="flex flex-col gap-md">
              {[1, 2, 3].map(i => (
                <Link key={i} to={`/news/${i}`} className="group flex flex-col gap-2">
                  <h4 className="font-label-md text-on-surface group-hover:text-primary transition-colors line-clamp-2">Cách tối ưu hóa tản nhiệt nước cho Server AI cỡ nhỏ</h4>
                  <p className="font-label-sm text-on-surface-variant text-[11px] flex items-center gap-1">
                    <span className="material-symbols-outlined text-[12px]">schedule</span> 10 May, 2026
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default NewsDetail;
