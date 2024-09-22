import Interface from './interface';

export default function Home() {
  const patient = { first_name: 'Alice' };
  return (
    <section className="flex flex-col sm:gap-2 sm:pb-20 h-full flex-1 w-1/2">
        <Interface firstname={patient?.first_name || 'Guest' } />
    </section>
  );
}