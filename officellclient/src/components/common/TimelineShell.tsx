import type { ReactNode, Ref, UIEventHandler } from "react";
import { Sidebar } from "./Sidebar";

type TimelineShellProps = {
  title: string;
  prominentTitle?: boolean;
  subtitle?: string;
  headerContent?: ReactNode;
  aside?: ReactNode;
  onScroll?: UIEventHandler<HTMLDivElement>;
  scrollRef?: Ref<HTMLDivElement>;
  children: ReactNode;
};

export const TimelineShell = ({ title, prominentTitle = false, subtitle, headerContent, aside, onScroll, scrollRef, children }: TimelineShellProps) => (
  <div className="h-screen w-full bg-gray-950 text-white">
    <Sidebar />
    <div ref={scrollRef} className="h-screen overflow-y-auto sm:ml-64" onScroll={onScroll}>
      <div className="mx-auto flex max-w-[1040px] items-start justify-center xl:gap-8 xl:px-4">
        <main className="min-h-screen w-full min-w-0 max-w-[640px]">
          <header className="sticky top-0 z-10 border-b border-gray-800 bg-gray-950/95 backdrop-blur-md">
            <div className={`flex items-center px-4 pl-16 sm:pl-5 ${prominentTitle ? 'min-h-24' : 'min-h-14'}`}>
              <div className={`min-w-0 ${prominentTitle ? 'py-4' : 'py-3'}`}>
                <h1 className={`max-w-full truncate ${prominentTitle ? 'text-4xl font-bold leading-tight tracking-tight text-white sm:text-5xl' : 'text-base font-medium leading-6 text-gray-100 sm:text-lg'}`}>{title}</h1>
                {subtitle && <span className="sr-only">{subtitle}</span>}
              </div>
            </div>
            {headerContent}
          </header>
          {children}
        </main>
        {aside && <aside className="sticky top-0 hidden w-[320px] shrink-0 space-y-5 py-5 xl:block">{aside}</aside>}
      </div>
    </div>
  </div>
);
