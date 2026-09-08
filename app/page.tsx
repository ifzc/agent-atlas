import Link from 'next/link';
import { ArrowRight, BookOpen } from 'lucide-react';
import { courseChapters } from '@/lib/course';
import './course.css';

export default function Home() {
  return (
    <div className="course-app">
      <header className="history-header">
        <Link href="/" className="history-brand">
          <span className="brand-symbol" aria-hidden="true">
            a.
          </span>
          <strong>Agent 技术课</strong>
        </Link>
        <span className="course-header-label">
          <BookOpen size={17} />
          课程目录
        </span>
      </header>
      <main className="course-main">
        <div className="course-heading">
          <span>课程目录</span>
          <h1>
            理解 Agent，
            <br />
            <em>从架构开始。</em>
          </h1>
          <p>选择章节，跟随时间轴逐步学习。</p>
        </div>
        <div className="course-chapters">
          {courseChapters.map((chapter) => (
            <article className="course-chapter" key={chapter.id}>
              <div className="course-chapter-number" aria-hidden="true">
                {chapter.number}
              </div>
              <div className="course-chapter-content">
                <div className="course-chapter-meta">
                  <span>{chapter.label}</span>
                  <span>{chapter.sections.length} 个小节 · 2023—2025</span>
                </div>
                <h2>
                  <Link href={chapter.href}>{chapter.title}</Link>
                </h2>
                <p>{chapter.description}</p>
                <ul className="course-topics">
                  {chapter.topics.map((topic) => (
                    <li key={topic}>{topic}</li>
                  ))}
                </ul>
                <div className="course-chapter-bottom">
                  <span>时间轴讲解 · 支持全屏</span>
                  <Link className="course-enter" href={chapter.href}>
                    进入{chapter.label}
                    <ArrowRight size={18} />
                  </Link>
                </div>
                <details className="course-outline">
                  <summary>查看本章的 {chapter.sections.length} 个小节</summary>
                  <ol>
                    {chapter.sections.map((section) => (
                      <li key={section.id}>
                        <span>{section.year}</span>
                        {section.label}
                      </li>
                    ))}
                  </ol>
                </details>
              </div>
            </article>
          ))}
        </div>
      </main>
      <footer className="course-footer">
        Agent 技术课<span>{courseChapters.length} 个章节 · 持续整理</span>
      </footer>
    </div>
  );
}
