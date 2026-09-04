import { getAllTestimonials } from "@/actions/admin/testimonials";
import TestimonialManager from "./_components/TestimonialManager";

export const metadata = { title: "Testimonials" };

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonials();

  return (
    <div>
      <div className="mb-8 border-b border-gold-400/20 pb-6">
        <h1 className="font-display text-3xl font-semibold text-ink">
          Home Page <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-gold-600 via-gold-500 to-gold-700">Testimonials</span>
        </h1>
        <p className="text-base text-ink/50 font-semibold mt-1">
          These customer quotes show in the "Customer Voices" carousel on the homepage.
        </p>
      </div>
      <TestimonialManager testimonials={testimonials} />
    </div>
  );
}
