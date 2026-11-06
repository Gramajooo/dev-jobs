import type { FC, ReactNode } from "react";

interface ImageProps {
  children?: ReactNode;
}
interface TitleProps {
  title?: ReactNode;
}
interface DescriptionProps {
  description?: ReactNode;
}
interface ArticleProps {
  children: ReactNode;
}

type CardArticleType = FC<ArticleProps> & {
  Image: FC<ImageProps>;
  Title: FC<TitleProps>;
  Description: FC<DescriptionProps>;
};

export const CardArticle: CardArticleType = (({ children }) => {
  return (
    <article className="card-interactive p-8 mb-4 flex flex-col gap-4">
      {children}
    </article>
  );
}) as CardArticleType;

CardArticle.Image = ({ children }) => {
  return (
    <div className="text-sky-400 bg-sky-500/15 border border-sky-500/30 w-14 h-14 rounded-full flex items-center justify-center p-3 [&_svg]:w-full [&_svg]:h-full">
      {children}
    </div>
  );
};

CardArticle.Title = ({ title = "Título" }) => {
  return <h3 className="font-semibold text-lg text-white">{title}</h3>;
};

CardArticle.Description = ({ description = "Descripción" }) => {
  return (
    <p className="text-slate-400 text-[0.95rem] leading-relaxed">
      {description}
    </p>
  );
};
