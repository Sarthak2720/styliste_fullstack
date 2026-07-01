import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Navbar from "../../components/layout/Navbar";
import { Footer } from "../../components/layout/Footer";
import ContactApi from "../../api/contactApi";
import heroContact from "../../assets/hero-contact.jpg";


const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const nameInputRef = useRef<HTMLInputElement>(null);
  const emailInputRef = useRef<HTMLInputElement>(null);
  const subjectInputRef = useRef<HTMLInputElement>(null);
  const messageInputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToField = (field: HTMLElement | null) => {
    if (!field) return;

    const targetTop = field.getBoundingClientRect().top + window.scrollY - 110;
    window.scrollTo({ top: Math.max(0, targetTop), behavior: "smooth" });
    window.setTimeout(() => {
      field.focus({ preventScroll: true });
    }, 250);
  };

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const getFirstInvalidField = (): { message: string; field: HTMLElement | null } | null => {
    if (!formData.name.trim()) {
      return { message: "Please enter your name", field: nameInputRef.current };
    }

    if (!formData.email.trim()) {
      return { message: "Please enter your email address", field: emailInputRef.current };
    }

    if (!validateEmail(formData.email)) {
      return { message: "Please enter a valid email address", field: emailInputRef.current };
    }

    if (!formData.subject.trim()) {
      return { message: "Please enter the subject", field: subjectInputRef.current };
    }

    if (!formData.message.trim()) {
      return { message: "Please enter your message", field: messageInputRef.current };
    }

    return null;
  };

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const firstInvalidField = getFirstInvalidField();
  if (firstInvalidField) {
    toast.error(firstInvalidField.message);
    scrollToField(firstInvalidField.field);
    return;
  }

  try {
    setLoading(true);

    const responseMessage = await ContactApi.sendMessage(formData);

    setSuccessMessage(
      typeof responseMessage === "string"
        ? responseMessage
        : "Your form was submitted successfully."
    );

    setSubmitted(true);

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    });
  } catch (error: any) {
    toast.error(
      error?.response?.data || "Failed to send message. Please try again."
    );
  } finally {
    setLoading(false);
  }
};

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const inputClass =
    "w-full bg-white border border-[#e5e5e5] text-[#1f1f1f] placeholder:text-[#9ca3af] focus:border-sage focus:ring-1 focus:ring-sage/30 outline-none rounded-md transition-all text-sm";

  return (
    <div className="bg-background text-foreground">

      {/* ================= HEADER ================= */}
      <section className="relative h-[56vh] min-h-[420px] max-h-[620px] overflow-hidden bg-primary text-primary-foreground">
        <Navbar />
        <div className="absolute inset-0">
          <img
            src={heroContact}
            alt="Styliste contact"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/85 via-primary/70 to-primary/60" />
        </div>
        <div className="absolute inset-0 z-10 flex items-center justify-center px-6 pt-20 text-center">
          <div className="container mx-auto">
            <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-4 mb-6"
            >
              <div className="w-8 h-px bg-primary-foreground/60" />
              <p className="text-primary-foreground/80 font-sans tracking-[0.3em] text-xs uppercase">
                Get in Touch
              </p>
              <div className="w-8 h-px bg-primary-foreground/60" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-7xl leading-[1.1] mb-8 text-primary-foreground"
            >
              Contact Us
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-primary-foreground/80 text-lg leading-relaxed"
            >
              We'd love to hear from you. Whether you have a question about our
              services or need styling advice, our team is here to help.
            </motion.p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= CONTENT ================= */}
      <section className="py-20 md:py-28">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

            {/* ========== CONTACT FORM ========== */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="relative min-h-[600px]"
            >
             <div className="relative bg-sage/10 rounded-2xl p-8 max-w-xl min-h-[420px] flex flex-col justify-center">
  <h2 className="font-serif text-3xl mb-6">Send a Message</h2>

{submitted && (
  <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/30 rounded-md">
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-10 text-center"
    >
      {/* Check Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      <h3 className="font-serif text-2xl mb-3 text-[#3b3b2c]">
        Submitted Successfully
      </h3>

      <p className="text-muted-foreground mb-8">
        {successMessage}
      </p>

      <button
        onClick={() => setSubmitted(false)}
        className="px-8 py-3 bg-sage text-white rounded-md hover:bg-sage/90 transition"
      >
        Go Back
      </button>
    </motion.div>
  </div>
)}

  <div className={submitted ? "opacity-30 pointer-events-none" : ""}>
  <form onSubmit={handleSubmit} noValidate className="space-y-4">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs uppercase tracking-[0.15em] text-[#1f1f1f] mb-3 block">
                      Name
                    </label>
                    <input
                      ref={nameInputRef}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      required
                      className={`${inputClass} h-11 px-4`}
                    />
                  </div>

                  <div>
                    <label className="text-xs uppercase tracking-[0.15em] text-[#1f1f1f] mb-3 block">
                      Email
                    </label>
                    <input
                      ref={emailInputRef}
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                      className={`${inputClass} h-11 px-4`}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-[#1f1f1f] mb-3 block">
                    Subject
                  </label>
                  <input
                    ref={subjectInputRef}
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="How can we help?"
                    required
                    className={`${inputClass} h-11 px-4`}
                  />
                </div>

                <div>
                  <label className="text-xs uppercase tracking-[0.15em] text-[#1f1f1f] mb-3 block">
                    Message
                  </label>
                  <textarea
                    ref={messageInputRef}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Tell us more..."
                    required
                    className={`${inputClass} px-4 py-3 resize-none`}
                  />
                </div>

                <button
  type="submit"
  disabled={loading}
  className={`inline-flex items-center gap-2 px-8 py-4 bg-sage text-primary-foreground transition-all rounded-md group
    ${loading ? "opacity-60 cursor-not-allowed" : "hover:bg-sage/90"}`}
>
  {loading ? "Sending..." : "Send Message"}
  {!loading && (
    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
  )}
</button>
              </form>
              </div>
</div>
            </motion.div>

            {/* ========== CONTACT INFO ========== */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <h2 className="font-serif text-3xl mb-8">Visit Our Boutique</h2>

              <p className="text-muted-foreground mb-10 leading-relaxed">
                Experience Styliste Couturier in person at our boutique. Our style
                consultants are available to provide personalized styling
                assistance and doorstep service.
              </p>

              <div className="space-y-8">
                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 border border-border flex items-center justify-center">
                    <Phone className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Phone</h3>
                    <a
                      href="tel:+917020601937"
                      className="text-muted-foreground text-sm hover:text-sage transition-colors"
                    >
                      +91 7020601937
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 border border-border flex items-center justify-center">
                    <Mail className="w-5 h-5 text-sage" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Email</h3>
                    <a
                      href="mailto:info@styliste-couturier.com"
                      className="text-muted-foreground text-sm hover:text-sage transition-colors"
                    >
                      info@styliste-couturier.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 border border-border flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-sage" />
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    F-44, 1st Floor, Raymond Realty TenX Vibes,
                    <br />
                    Pokharan Rd. No. 2, Thane West - 400606
                  </p>
                </div>

                <div className="flex items-start gap-5">
                  <div className="w-14 h-14 border border-border flex items-center justify-center">
                    <Clock className="w-5 h-5 text-sage" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Tuesday – Sunday: 11 AM – 8 PM
                    <br />
                    Monday: Closed
                  </p>
                </div>
              </div>

              {/* Map */}
             <div className="mt-10 aspect-video bg-secondary overflow-hidden rounded-md">
  <iframe
    src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d7535.1426258730435!2d72.9638102669468!3d19.21391739277337!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sstyliste%20couturier!5e0!3m2!1sen!2sin!4v1769664608496!5m2!1sen!2sin"
    className="w-full h-full border-0"
    loading="lazy"
    referrerPolicy="no-referrer-when-downgrade"
    allowFullScreen
    title="Styliste Couturier Location"
  />
</div>                 
            </motion.div>

          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Contact;
