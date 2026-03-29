import Services from '../../../src/components/Services';

export const metadata = {
  title: 'Spa Services & Packages | The Serenity Spa',
  description: 'View our full price list for Swedish massage, aromatherapy, deep tissue massage, and VIP spa packages in Kampala.',
};

export default function ServicesPage() {
  return (
    <div style={{ marginTop: '80px' }}>
      <Services />
    </div>
  );
}
