import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface GoalCelebrationProps {
    isOpen: boolean;
    onClose: () => void;
    dailyGoal: number;
}

const GoalCelebration: React.FC<GoalCelebrationProps> = ({ isOpen, onClose, dailyGoal }) => {
    const [showConfetti, setShowConfetti] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setShowConfetti(true);
            const timer = setTimeout(() => setShowConfetti(false), 5000);
            return () => clearTimeout(timer);
        }
    }, [isOpen]);

    // Simple pure CSS/Framer Motion confetti
    const Confetti = () => {
        const colors = ['#f59e0b', '#ef4444', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
        return (
            <div className="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
                {Array.from({ length: 50 }).map((_, i) => (
                    <motion.div
                        key={i}
                        initial={{
                            top: -20,
                            left: `${Math.random() * 100}%`,
                            scale: Math.random() * 0.5 + 0.5,
                            rotate: 0,
                            opacity: 1
                        }}
                        animate={{
                            top: '120%',
                            left: `${(Math.random() * 20 - 10) + (i * 2)}%`,
                            rotate: 360 * (Math.random() > 0.5 ? 1 : -1),
                            opacity: 0
                        }}
                        transition={{
                            duration: Math.random() * 2 + 2,
                            repeat: Infinity,
                            delay: Math.random() * 5,
                            ease: "linear"
                        }}
                        style={{
                            position: 'absolute',
                            width: '10px',
                            height: '10px',
                            backgroundColor: colors[Math.floor(Math.random() * colors.length)],
                            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                        }}
                    />
                ))}
            </div>
        );
    };

    return (
        <>
            <AnimatePresence>
                {showConfetti && <Confetti />}
            </AnimatePresence>

            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.8, opacity: 0, y: 20 }}
                            className="relative bg-gradient-dark border border-light/20 p-8 rounded-[2.5rem] max-w-md w-full text-center shadow-2xl"
                        >
                            <button
                                onClick={onClose}
                                className="absolute top-6 right-6 p-2 rounded-full hover:bg-white/10 transition-colors"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>

                            <motion.div
                                initial={{ rotate: -10, scale: 0 }}
                                animate={{ rotate: 0, scale: 1 }}
                                transition={{ type: "spring", delay: 0.2 }}
                                className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 relative"
                            >
                                <Trophy className="w-12 h-12 text-primary" />
                                <motion.div
                                    animate={{ scale: [1, 1.2, 1] }}
                                    transition={{ repeat: Infinity, duration: 2 }}
                                    className="absolute -top-1 -right-1"
                                >
                                    <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                </motion.div>
                                <Sparkles className="absolute -bottom-1 -left-1 w-6 h-6 text-blue-400" />
                            </motion.div>

                            <h2 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-primary to-tertiary">
                                Goal Reached!
                            </h2>
                            <p className="text-muted-foreground mb-8">
                                Amazing work! You've mastered {dailyGoal} words today. Keep up the fantastic momentum!
                            </p>

                            <div className="space-y-4">
                                <Button
                                    onClick={onClose}
                                    className="w-full h-14 rounded-full text-lg font-bold btn-1 hover:scale-105 transition-transform"
                                >
                                    Continue Learning
                                </Button>
                                <p className="text-xs text-muted-foreground italic">
                                    "Knowledge is power. Information is liberating."
                                </p>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
};

export default GoalCelebration;
