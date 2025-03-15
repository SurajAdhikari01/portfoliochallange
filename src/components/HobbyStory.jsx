"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Book, Film, Palette, Cat } from "lucide-react";
import { Button } from "./ui/button";

const storyContent = {
  reading: {
    title: "Lost in Stories",
    image: "/placeholder-reading.jpg",
    content: [
      "There's something magical about opening a new book. The scent of fresh pages, the weight in my hands, and the anticipation of adventures to come.",
      "Whether it's getting lost in fantasy worlds, learning about new perspectives through memoirs, or diving into historical fiction, reading has always been my favorite escape.",
      "My bookshelf is filled with dog-eared favorites and new discoveries waiting to be explored. Each book is a doorway to somewhere new.",
    ],
    quote:
      '"A reader lives a thousand lives before they die. The one who never reads lives only one." — George R.R. Martin',
  },
  watching: {
    title: "The Drama Enthusiast",
    image: "/placeholder-watching.jpg",
    content: [
      "There's nothing quite like getting invested in a good drama series. The anticipation of plot twists, the emotional connection with characters, and the satisfaction of a well-crafted story.",
      "I love shows that make me think, make me feel, and occasionally make me cry. From Korean dramas to British mysteries, I'm always on the lookout for the next great series.",
      "My perfect evening? A cozy blanket, a cup of tea, and just one more episode (that turns into three).",
    ],
    quote:
      '"Television is by nature the dominator drug par excellence. Control of content, uniformity of content, repeatability of content make it inevitably a tool of coercion, brainwashing, and manipulation." — Jerry Mander',
  },
  painting: {
    title: "Colors of Expression",
    image: "/placeholder-painting.jpg",
    content: [
      "Painting is my meditation. When I pick up a brush, time seems to slow down and my mind focuses only on the dance of colors across the canvas.",
      "I love experimenting with different styles and techniques – from watercolor landscapes to abstract acrylics. There's something so freeing about expressing emotions through visual art.",
      "The beauty of painting is that there are no mistakes, only happy accidents that lead to unexpected beauty. Each piece tells a story of my inner world.",
    ],
    quote: '"Painting is just another way of keeping a diary." — Pablo Picasso',
  },
  lucy: {
    title: "Life with Lucy",
    image: "/placeholder-lucy.jpg",
    content: [
      "Lucy came into my life three years ago, a small ball of fur with curious eyes and a playful spirit. Since then, she's become my constant companion and greatest joy.",
      "Our daily rituals include morning cuddles, afternoon play sessions with her favorite feather toy, and evening relaxation as she curls up beside me while I read or watch TV.",
      "There's something so special about the bond between a person and their pet. Lucy understands my moods, provides comfort on tough days, and makes every day brighter with her quirky personality.",
    ],
    quote: '"Time spent with cats is never wasted." — Sigmund Freud',
  },
};

export default function HobbyStory() {
  const [activeHobby, setActiveHobby] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);

  // Close story when escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
        setTimeout(() => setActiveHobby(null), 300);
      }
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, []);

  // Reset page when hobby changes
  useEffect(() => {
    setCurrentPage(0);
  }, [activeHobby]);

  const openStory = (hobby) => {
    setActiveHobby(hobby);
    setTimeout(() => setIsOpen(true), 100);
  };

  const closeStory = () => {
    setIsOpen(false);
    setTimeout(() => setActiveHobby(null), 300);
  };

  const nextPage = () => {
    if (!activeHobby) return;
    if (currentPage < storyContent[activeHobby].content.length) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
        <HobbyCard
          title="Reading Books"
          icon={<Book className="w-6 h-6" />}
          onClick={() => openStory("reading")}
        />
        <HobbyCard
          title="Watching Dramas"
          icon={<Film className="w-6 h-6" />}
          onClick={() => openStory("watching")}
        />
        <HobbyCard
          title="Painting"
          icon={<Palette className="w-6 h-6" />}
          onClick={() => openStory("painting")}
        />
        <HobbyCard
          title="Time with Lucy"
          icon={<Cat className="w-6 h-6" />}
          onClick={() => openStory("lucy")}
        />
      </div>

      <AnimatePresence>
        {activeHobby && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeStory}
            />

            <motion.div
              className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl w-full max-w-4xl z-10 relative"
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{
                scale: isOpen ? 1 : 0.9,
                y: isOpen ? 0 : 20,
                opacity: isOpen ? 1 : 0,
              }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", damping: 30 }}
            >
              <button
                onClick={closeStory}
                className="absolute top-4 right-4 z-30 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
                aria-label="Close story"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>

              <div className="grid md:grid-cols-2 h-full max-h-[80vh]">
                <div className="relative aspect-[3/4] md:aspect-auto md:h-full">
                  {activeHobby && (
                    <img
                      src={storyContent[activeHobby].image}
                      alt={storyContent[activeHobby].title}
                      className="object-cover w-full h-full"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
                    <h3 className="text-white text-3xl font-bold p-6">
                      {activeHobby && storyContent[activeHobby].title}
                    </h3>
                  </div>
                </div>

                <div className="p-6 md:p-8 flex flex-col h-full overflow-hidden">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`content-${currentPage}`}
                      className="flex-1 overflow-y-auto pr-2 styled-scrollbar"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      {activeHobby &&
                      currentPage < storyContent[activeHobby].content.length ? (
                        <p className="text-lg leading-relaxed mb-6 text-gray-800 dark:text-gray-200">
                          {storyContent[activeHobby].content[currentPage]}
                        </p>
                      ) : (
                        <>
                          <p className="text-lg leading-relaxed mb-8 text-gray-800 dark:text-gray-200 italic">
                            {activeHobby && storyContent[activeHobby].quote}
                          </p>
                          <div className="text-center">
                            <Button
                              variant="outline"
                              onClick={closeStory}
                              className="mt-4 border-pink-400 text-pink-600 hover:bg-pink-50"
                            >
                              Close
                            </Button>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </AnimatePresence>

                  <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <Button
                      variant="ghost"
                      onClick={prevPage}
                      disabled={currentPage === 0}
                      className={currentPage === 0 ? "invisible" : ""}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-500">
                      {activeHobby &&
                        `${currentPage + 1} of ${
                          storyContent[activeHobby].content.length + 1
                        }`}
                    </span>
                    <Button
                      variant="ghost"
                      onClick={nextPage}
                      className={
                        currentPage >=
                        (activeHobby
                          ? storyContent[activeHobby].content.length
                          : 0)
                          ? "invisible"
                          : ""
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function HobbyCard({ title, icon, onClick }) {
  return (
    <motion.div
      className="bg-white dark:bg-gray-800 rounded-xl shadow-md h-full overflow-hidden cursor-pointer group"
      onClick={onClick}
      whileHover={{ y: -5 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <div className="p-6 flex flex-col items-center text-center">
        <motion.div
          className="mb-6 p-4 bg-pink-100 dark:bg-pink-900/30 rounded-full"
          whileHover={{ rotate: [0, -10, 10, -10, 0] }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-pink-600 dark:text-pink-400">{icon}</div>
        </motion.div>

        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>

        <motion.p
          className="text-sm text-pink-600 dark:text-pink-400 font-medium mt-2 flex items-center"
          initial={{ opacity: 0.5 }}
          whileHover={{ scale: 1.05 }}
        >
          Read my story
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4 ml-1 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </motion.p>

        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-pink-300 to-pink-500 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
      </div>
    </motion.div>
  );
}
