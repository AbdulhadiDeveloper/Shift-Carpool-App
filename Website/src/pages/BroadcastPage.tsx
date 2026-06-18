import BroadcastForm from '../components/forms/BroadcastForm';

export default function BroadcastPage() {
  return (
    <div className="grow flex items-center justify-center p-4 py-8 relative">
      <div className="w-full max-w-2xl bento-card shadow-2xl relative z-10">
        <div className="mb-8">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Broadcast a Route</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant">
            Share your journey and split costs with verified commuters.
          </p>
        </div>
        
        <BroadcastForm />
      </div>
    </div>
  );
}
