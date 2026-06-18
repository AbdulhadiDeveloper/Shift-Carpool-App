export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-12 h-12 rounded-full border-4 border-surface-variant border-t-primary animate-spin"></div>
    </div>
  );
}
