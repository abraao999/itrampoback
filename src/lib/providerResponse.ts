export function publicProvider(provider: {
  _id: unknown;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  specialtySlug: string;
  specialtyName: string;
  city?: string;
  status: string;
}) {
  return {
    id: String(provider._id),
    name: provider.name,
    email: provider.email,
    phone: provider.phone,
    companyName: provider.companyName,
    specialtySlug: provider.specialtySlug,
    specialtyName: provider.specialtyName,
    city: provider.city,
    status: provider.status
  };
}
