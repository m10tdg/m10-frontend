import { useLangStore } from '@/shared/stores/langStore'
import { translations } from '@/shared/config/i18n'
import { bg } from '@/shared/styles/colors'
import { StarRating } from '@/shared/ui/StarRating'

export function TestimonialsWidget() {
  
  const { lang } = useLangStore()
  const tx = translations[lang]

  return(
    <>
      <section className="py-20 px-4" style={{ backgroundColor: "#ffffff" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span
              className="inline-block px-3 py-1 rounded-full text-sm mb-3 border"
              style={{
                backgroundColor: "#F3F0FF",
                borderColor: "#D9D0FF",
                color: "#7048E8",
                fontFamily: "Inter, sans-serif",
              }}
            >
              {tx.testimonials.badge}
            </span>
            <h2
              className="mb-4"
              style={{ fontSize: "2rem", color: "#111827", fontFamily: "Inter, sans-serif" }}
            >
              {tx.testimonials.title}
            </h2>
            <p
              className="text-gray-500 max-w-2xl mx-auto"
              style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
            >
              {tx.testimonials.subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {tx.testimonials.items.map(
              (
                item: {
                  name: string;
                  role: string;
                  avatar: string;
                  text: string;
                  rating: number;
                },
                idx: number
              ) => (
                <div
                  key={idx}
                  className="flex flex-col p-7 rounded-2xl border border-gray-100 hover:shadow-md transition-all"
                  style={{ backgroundColor: bg }}
                >
                  {/* Stars */}
                  <StarRating count={item.rating} />

                  {/* Quote */}
                  <p
                    className="mt-4 mb-6 text-sm text-gray-600 flex-1"
                    style={{ fontFamily: "Inter, sans-serif", lineHeight: 1.7 }}
                  >
                    "{item.text}"
                  </p>

                  {/* Author */}
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-200">
                    <img
                      src={item.avatar}
                      alt={item.name}
                      className="w-11 h-11 rounded-full object-cover"
                    />
                    <div>
                      <div
                        className="text-sm text-gray-900"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {item.name}
                      </div>
                      <div
                        className="text-xs text-gray-400"
                        style={{ fontFamily: "Inter, sans-serif" }}
                      >
                        {item.role}
                      </div>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </section>
      </>
  )
}