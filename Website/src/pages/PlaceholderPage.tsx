export default function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="grow flex items-center justify-center">
      <div className="bento-card text-center max-w-md w-full">
        <h1 className="text-headline-lg font-bold text-primary mb-3">{title}</h1>
        <p className="text-on-surface-variant">This page is under construction.</p>
      </div>
    </div>
  );
}
