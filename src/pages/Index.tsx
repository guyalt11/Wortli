import { useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { BookOpen, Brain, Zap, Target, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { motion, useScroll, useTransform, Variants } from "framer-motion";
import { DirectionFlag } from '@/components/FlagIcon';
import GenderTag from '@/components/GenderTag';
import { Card } from '@/components/ui/card';
import { Gender } from '@/types/vocabulary';

const Index = () => {
  const navigate = useNavigate();
  const { scrollY } = useScroll();

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    document.title = "Wörtli | AI-Powered Vocabulary Learning & Flashcards";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute("content", "Master any language naturally with Wörtli. Create AI-powered flashcards, track your progress, and practice with smart spaced repetition.");
    } else {
      const meta = document.createElement('meta');
      meta.name = "description";
      meta.content = "Master any language naturally with Wörtli. Create AI-powered flashcards, track your progress, and practice with smart spaced repetition.";
      document.head.appendChild(meta);
    }
  }, []);

  // Parallax effect for background elements
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  const features = [
    {
      icon: <Brain className="h-12 w-12 text-light" />,
      title: "AI-Powered Learning",
      description: "Generate vocabulary lists instantly with our AI assistant tailored to your customized learning goals."
    },
    {
      icon: <Target className="h-12 w-12 text-light" />,
      title: "Smart Practice System",
      description: "Adaptive spaced repetition ensures you review words at the perfect time for maximum retention."
    },
    {
      icon: <Zap className="h-12 w-12 text-light" />,
      title: "Track Your Progress",
      description: "Build a learning habit with daily goals and streaks to keep you motivated and win rewards."
    },
    {
      icon: <BookOpen className="h-12 w-12 text-light" />,
      title: "Shared Library",
      description: "Access our community library with a wide range of vocabulary lists for over 50 languages."
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10
      }
    }
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden font-sans">
      {/* Animated Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          style={{ y: y1 }}
          className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-primary opacity-5 rounded-full blur-[120px]"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute top-[20%] -right-[10%] w-[40%] h-[60%] bg-secondary opacity-5 rounded-full blur-[140px]"
        />
        <div className="absolute bottom-[0%] left-[20%] w-[40%] h-[40%] bg-light opacity-5 rounded-full blur-[100px]" />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 h-screen flex flex-col justify-center items-center px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="flex flex-col items-center"
          >
            {/* Logo & Badge */}
            <motion.div variants={itemVariants} className="mb-8 relative group">
              <div className="absolute inset-0 bg-primary opacity-20 blur-2xl rounded-full group-hover:opacity-30 transition-opacity duration-500" />
              <img
                src="/logo.webp"
                alt="Wörtli Logo"
                className="w-20 h-20 sm:w-28 sm:h-28 relative z-10 drop-shadow-2xl hover:scale-110 transition-transform duration-500"
              />
            </motion.div>

            {/* Updated Typography - Cleaner 'Heathers' (Headers) */}
            <motion.h1 variants={itemVariants} className="flex flex-col items-center justify-center font-extrabold tracking-tight mb-6">
              <span className="text-6xl md:text-8xl mb-2 home-title tracking-tighter drop-shadow-sm">
                Wörtli
              </span>
              <span className="sr-only">AI-Powered Vocabulary Flashcards for Language Learning</span>
            </motion.h1>

            <motion.div variants={itemVariants} className="mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary border backdrop-blur-md text-light light:text-muted-foreground text-sm font-medium shadow-lg shadow-primary/5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI-Powered flashcards</span>
              </span>
            </motion.div>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              <span className="md:text-2xl lg:text-4xl text-tertiary font-bold max-w-4xl mx-auto leading-tight">
                Master Any Language Naturally & Effortlessly
              </span>
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5 justify-center items-center w-full sm:w-auto">
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="w-full sm:w-auto text-lg h-14 px-10 rounded-full shadow-xl font-semibold transition-all duration-300 transform hover:-translate-y-1"
              >
                Get Started Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto text-lg h-14 px-10 rounded-full border-2 border-dashed border-tertiary hover:border-tertiary hover:bg-secondary light:hover:bg-dark hover:text-light transition-all duration-300 relative bg-background backdrop-blur-sm"
              >
                Have an account?
              </Button>
            </motion.div>

            <motion.button
              variants={itemVariants}
              onClick={() => scrollToSection('features-section')}
              className="mt-16 sm:mt-24 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Scroll to features"
            >
              <ChevronDown className="w-8 h-8 text-muted-foreground" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features-section" className="relative z-10 min-h-screen flex flex-col justify-center items-center py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center"
          >
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-foreground tracking-tight">
                Stop wasting time!
              </h2>
              <p className="text-muted-foreground text-xl max-w-2xl mx-auto">
                Here are some of the reasons why Wörtli is so effective.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center text-center p-8 rounded-2xl bg-gradient-dark hover:scale-105 transition-all duration-300 shadow-xl border border-white/5"
                >
                  <div className="mb-6 bg-white/10 light:bg-dark p-4 rounded-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-4 text-white light:text-dark">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <motion.button
              onClick={() => scrollToSection('how-it-works-section')}
              className="mt-20 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
              aria-label="Scroll to how it works"
            >
              <ChevronDown className="w-8 h-8 text-muted-foreground" />
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* How it Works / About Section for SEO */}
      <section id="how-it-works-section" className="relative z-10 min-h-screen flex flex-col justify-center items-center py-20 bg-secondary/5">
        <div className="container mx-auto px-4 max-w-4xl flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="prose prose-lg dark:prose-invert mx-auto text-left w-full"
          >
            <h2 className="text-2xl md:text-4xl font-bold mb-12 text-center text-foreground font-sans tracking-tight">How Wörtli Transforms Your Language Journey</h2>
            <div className="space-y-10">
              <div className="p-2">
                <h3 className="text-2xl font-semibold mb-4 text-tertiary">Smart Flashcards, Faster Memory</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Traditional learning can feel like a chore - hours spent typing words, searching translations, and formatting lists drain motivation. Wörtli removes that friction. With our <strong>AI assistant</strong>, generate lists in second, while avoiding duplicates. Create your own or explore our <strong>community library</strong> to start learning instantly.
                </p>
              </div>
              <div className="p-2">
                <h3 className="text-2xl font-semibold mb-4 text-tertiary">Science-Backed Spaced Repetition</h3>
                <p className="text-muted-foreground leading-relaxed text-lg">
                  Our practice engine uses the renowned <strong>SM2 algorithm</strong>, a top implementation of <strong>Spaced Repetition (SRS)</strong>. SM2 optimizes long-term retention by timing reviews perfectly. Instead of cramming, we remind you just as you’re about to forget, making language learning faster, more natural, and effortless.
                </p>
              </div>
              <div className="text-center">
                <Button variant="link" onClick={() => navigate('/about')} className="text-tertiary font-bold text-xl group">
                  Read more about our mission
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          </motion.div>

          <motion.button
            onClick={() => scrollToSection('example-section')}
            className="mt-20 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Scroll to examples"
          >
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          </motion.button>
        </div>
      </section>

      {/* Example / Demo Section for SEO and Users */}
      <section id="example-section" className="relative z-10 min-h-screen flex flex-col justify-center items-center py-10">
        <div className="container mx-auto px-4 max-w-5xl text-center flex flex-col items-center">
          <div className="mb-8">
            <h2 className="text-2xl md:text-4xl font-bold mb-2 tracking-tight">See Wörtli in Action</h2>
            <p className="hidden text-muted-foreground text-xl max-w-2xl mx-autoLeading-relaxed">
              The heart of your daily habit. These cards aren't just static text—they are smart, context-rich tools designed to help you actually remember. Flip them to see how we bring every word to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[
              {
                origin: "der Frühling",
                transl: "Spring",
                listLanguage: "de",
                listTarget: "en",
                gender: "m",
                notes: "Use 'im' for 'in spring'."
              },
              {
                origin: "木洩れ日 (Komorebi)",
                transl: "Sunlight through trees",
                listLanguage: "ja",
                listTarget: "en",
                gender: null,
                notes: "Sunrays through leaves."
              },
              {
                origin: "la bibliothèque",
                transl: "Library",
                listLanguage: "fr",
                listTarget: "en",
                gender: "f",
                notes: "Silent 'qu'."
              },
              {
                origin: "سلام (Salām)",
                transl: "Paz",
                listLanguage: "ar",
                listTarget: "es",
                gender: "m",
                notes: "Tanto paz como saludos"
              },
              {
                origin: "Gleði (Glethi)",
                transl: "שמְחָה",
                listLanguage: "is",
                listTarget: "he",
                gender: "n",
                notes: "Joy, happiness"
              },
              {
                origin: "Tack",
                transl: "Merci",
                listLanguage: "sv",
                listTarget: "fr",
                gender: null,
                notes: "eg. Tack för maten."
              }
            ].map((word, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="w-full group perspective-1000"
              >
                <div className="relative bg-gradient-dark w-full rounded-2xl min-h-[250px] transition-all duration-700 transform-style-3d group-hover:rotate-y-180">
                  {/* Front Face */}
                  <Card className="absolute inset-0 backface-hidden flex flex-col justify-center items-center p-8 bg-card border-none shadow-xl rounded-3xl">
                    <div className="text-center w-full">
                      <div className="mb-4 text-muted-foreground text-sm flex justify-center">
                        <DirectionFlag
                          direction="translateTo"
                          size={18}
                          language={word.listLanguage}
                          target={word.listTarget}
                        />
                      </div>
                      <div className="flex items-center justify-center gap-3">
                        <h3 className="text-2xl font-bold tracking-tight light:text-muted-foreground">{word.origin}</h3>
                        {word.gender && (
                          <div className={`bg-gender-${word.gender} rounded-full text-dark light:text-muted-foreground scale-90`}>
                            <GenderTag gender={word.gender as Gender} />
                          </div>
                        )}
                      </div>
                      {word.notes && (
                        <div className="mt-4 text-xs p-3 rounded-xl italic text-muted-foreground bg-secondary/20">
                          {word.notes}
                        </div>
                      )}
                      <div className="mt-6 text-[10px] text-muted-foreground/50 uppercase tracking-widest font-semibold light:text-muted-foreground">
                        Click to reveal
                      </div>
                    </div>
                  </Card>

                  {/* Back Face */}
                  <Card className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col items-center p-8 bg-card border-none shadow-xl rounded-3xl border-2">
                    <div className="text-center w-full flex-1 flex flex-col p-4">
                      <div className="mb-2 text-muted-foreground text-sm flex justify-center">
                        <DirectionFlag
                          direction="translateFrom"
                          size={18}
                          language={word.listLanguage}
                          target={word.listTarget}
                        />
                      </div>
                      <h4 className="text-2xl font-bold light:text-muted-foreground">{word.transl}</h4>
                    </div>

                    {/* Minimal Difficulty Buttons Mock */}
                    <div className="w-full pt-4 border-t border-muted/20 light:border-dark">
                      <div className="text-[10px] text-muted-foreground mb-3 font-semibold uppercase tracking-wider">How well did you know this?</div>
                      <div className="flex gap-1.5 w-full">
                        {['Hard', 'OK', 'Good', 'Perfect'].map((diff) => (
                          <div
                            key={diff}
                            className={`flex-1 h-8 rounded-lg text-[10px] flex items-center justify-center font-bold text-black shadow-sm
                              ${diff === 'Hard' ? 'bg-difficulty-hard' :
                                diff === 'OK' ? 'bg-difficulty-ok' :
                                  diff === 'Good' ? 'bg-difficulty-good' :
                                    'bg-difficulty-perfect'}`}
                          >
                            {diff}
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.button
            onClick={() => scrollToSection('cta-section')}
            className="mt-8 animate-bounce opacity-50 hover:opacity-100 transition-opacity cursor-pointer"
            aria-label="Scroll to call to action"
          >
            <ChevronDown className="w-8 h-8 text-muted-foreground" />
          </motion.button>
        </div>
      </section>

      {/* CTA Section - Refined */}
      <section id="cta-section" className="relative z-10 min-h-screen flex flex-col justify-center items-center py-32 px-4 overflow-hidden">
        <div className="container mx-auto max-w-5xl relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-dark to-secondary rounded-[2.5rem] p-8 md:p-20 text-center text-white shadow-2xl relative overflow-hidden"
          >
            {/* Decorative background circles */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white opacity-10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 mix-blend-overlay" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-black opacity-10 rounded-full blur-3xl translate-x-1/2 translate-y-1/2 mix-blend-overlay" />

            <div className="relative z-10 flex flex-col items-center">
              <h2 className="text-3xl md:text-6xl font-bold mb-8 text-white tracking-tight light:text-dark">
                Start your journey today
              </h2>
              <p className="text-muted-foreground text-xl mb-12 max-w-2xl mx-auto font-medium">
                Join our growing community of language enthusiasts.
              </p>
              <Button
                size="lg"
                onClick={() => navigate('/register')}
                className="bg-light light:bg-dark text-primary light:text-white h-16 px-12 text-md md:text-xl rounded-full font-bold shadow-lg transition-transform hover:scale-105 w-full sm:w-auto"
              >
                Start Learning Now
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Index;
