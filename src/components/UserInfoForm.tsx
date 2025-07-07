import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import AnimatedText from "./AnimatedText";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface UserInfo {
  name: string;
  age: string;
  gender: string;
  randomAnswer: string;
}

interface UserInfoFormProps {
  onComplete: (userInfo: UserInfo) => void;
}

const UserInfoForm: React.FC<UserInfoFormProps> = ({ onComplete }) => {
  const [currentField, setCurrentField] = useState<'name' | 'age' | 'gender' | 'random'>('name');
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: '',
    age: '',
    gender: '',
    randomAnswer: ''
  });
  const [currentInput, setCurrentInput] = useState("");
  const [promptComplete, setPromptComplete] = useState(false);
  const [showError, setShowError] = useState(false);
  const [bump, setBump] = useState(false);
  const [randomQuestion, setRandomQuestion] = useState("");
  const [timerActive, setTimerActive] = useState(false);
  const [inputLocked, setInputLocked] = useState(false);
  const [showSarcasm, setShowSarcasm] = useState(false);
  const [sarcasmText, setSarcasmText] = useState("");
  const [showLoading, setShowLoading] = useState(false);
  const navigate = useNavigate();

  // Random incredibly specific questions
  const randomQuestions = [
    "When's the last time you made direct eye contact with a toaster and felt something?",
    "Do you also trust people who don't flinch when microwaves beep too loudly?",
    "If your dreams were sponsored, who do you think would be paying for them?",
    "When your phone dies at 3%, do you take it personally?",
    "If your soul had a loading screen, what would it say?",
    "Which of your socks do you think is planning something?",
    "Have you ever made a life decision based on a vibe check from a pigeon?",
    "What would your emotional support traffic cone say about you?",
    "Is your Spotify algorithm trying to warn you or insult you?",
    "When you say \"I'm fine,\" how many lies are you layering into that sentence?",
    "What object in your house would immediately betray you in a Pixar film?",
    "If your reflection winked first, what's your next move?",
    "What's your favorite flavor of existential dread?",
    "Would your childhood self high-five you or stage a quiet intervention?",
    "What sound does your anxiety make when it tries to parallel park?",
    "If your comfort YouTube video were illegal in one country, which one would it be and why?",
    "Be honest—do you sometimes talk to your phone like it's a fragile child with low self-esteem?",
    "What's the most emotionally manipulative snack?",
    "If your browser history leaked as a memoir, would it be a comedy or a tragedy?",
    "On a scale of 1 to \"I googled it twice,\" how well do you understand taxes?",
    "Have you ever tried to manifest something and accidentally summoned a vibe you weren't ready for?",
    "If you had to make small talk with your past self, what's the first weird thing you'd say?",
    "What do you think your pillow would say about your current life choices?",
    "Have you ever felt bullied by your own calendar?",
    "Do you also get nervous when autocorrect is too confident?",
    "What's the weirdest hill you're willing to die on, and how did you find it?",
    "If your keyboard started offering unsolicited advice, would you listen?",
    "When you say \"I'm doing great,\" do your plants believe you?",
    "What's your emergency meal when hope is gone and so is the will to cook?",
    "What cursed item do you keep for no good reason except spiritual obligation?",
    "If you had to fight your sleep paralysis demon in a Walmart, who would win?",
    "When you open a new tab and forget why, do you feel like the simulation is judging you?",
    "What's the most chaotic thing you've ever done with scissors?",
    "What's your villain origin story in five emojis or less?",
    "Do you think your favorite hoodie has witnessed too much?",
    "If your personality was a haunted house attraction, what would be the scariest room?",
    "What phrase do you say so often it's basically your spiritual ringtone?",
    "Have you ever bought something just to feel something?",
    "What would your FBI agent nickname you based on your tabs?",
    "If you could scream one sentence into the void, what would it be?",
    "What's your go-to excuse that even you don't believe anymore?",
    "When do you usually realize you're procrastinating: before or after cleaning your whole apartment?",
    "Which fictional character lives rent-free in your last remaining brain cell?",
    "Do you believe in fate, or do you just think you're bad at scheduling?",
    "If your sleep schedule was a business, what kind of bankruptcy would it file?",
    "When the power goes out, do you immediately assume the apocalypse or calmly light a candle like a Victorian ghost?",
    "What's the most serious decision you've made while wearing socks with holes in them?",
    "When did you last stare into the fridge for wisdom instead of food?",
    "What's your least functional coping mechanism that's kind of working?",
    "Would you rather fight one horse-sized toddler or ten toddler-sized horses, and why is this morally complicated for you?",
    "If time is fake, why are deadlines so aggressive?",
    "Have you ever practiced your Oscar speech just in case someone noticed your trauma?",
    "What appliance in your kitchen do you think would win in a fistfight?",
    "Which emotion do you assign to your unread emails?",
    "If someone opened your junk drawer, would they find chaos or a portal?",
    "What's your internal monologue's font and why is it Comic Sans today?",
    "Do you also feel like your charging cable is quietly judging your life choices?",
    "What's the most passive-aggressive weather event you've lived through?",
    "If your life had a loading bar, what percentage would be \"buffering\"?",
    "Have you ever given your computer a pep talk before installing an update?",
    "What is your alarm clock's true personality and do you respect it?",
    "What's your grocery store alter ego?",
    "If your sleep had a genre, what would it be?",
    "When someone says \"fun fact,\" do you mentally prepare for trauma?",
    "Do you ever get the intense urge to completely disappear and rebrand as someone who owns a boat?",
    "Have you ever felt personally attacked by your own handwriting?",
    "What's your favorite flavor of denial?",
    "If your thoughts had subtitles, what would they say during a Zoom meeting?",
    "What's your most irrational fear that you secretly think might be valid?",
    "If your phone battery represented your life force, how close are you to low power mode?",
    "Do you think your past self would trust your current self with a secret?",
    "Which inanimate object in your life is definitely haunted but you're too tired to care?",
    "What's your spirit insect and why is it slightly inconvenient?",
    "Have you ever tried to fix a vibe with a snack?",
    "When your phone buzzes, do you assume hope or doom?",
    "What would your autobiography be titled if it had to be written in all lowercase?",
    "How many times can one person check the fridge before it counts as a meditation?",
    "If your brain had browser tabs, what's always open and slowing everything down?",
    "Do you think the moon knows you're ignoring your to-do list again?",
    "What's your favorite irrational rule you've invented for yourself?",
    "If your socks had a union, what would they be protesting?",
    "When was the last time you genuinely gaslit yourself into being productive?",
    "If you could outsource one emotion, which would it be and who would you hire?",
    "Have you ever opened your camera accidentally and reconsidered your entire existence?",
    "What's the most suspicious food in your fridge right now?",
    "If mirrors showed your emotional state instead of appearance, what would yours reflect today?",
    "Do you also think autocorrect is trying to sabotage your credibility one typo at a time?",
    "What's the most intense commitment you've made to a completely pointless habit?",
    "If your inner child had a Yelp review of your adulthood, what would it say?",
    "When your laptop fan kicks in, do you interpret that as mutual panic?",
    "What's the worst advice you've ever followed successfully?",
    "If your mood was a browser notification, what would it say?",
    "Have you ever stared at your own text bubble waiting for it to respond?",
    "What do you think your search history would look like if it was narrated by David Attenborough?",
    "When you're alone in a car, what alter ego takes the wheel?",
    "If your subconscious curated a Spotify playlist, what would the title be?",
    "Have you ever eaten something just because the packaging guilt-tripped you?",
    "What's your most delusional belief that keeps you functioning?",
    "If your thoughts had an \"are you still watching?\" button, how often would it pop up?",
    "If someone asked how you're doing and you had to respond using only kitchen utensils, what would you hand them?"
  ];

  // Sarcastic responses for random question timer
  const sarcasmResponses = [
    "Too honest. Abort.",
    "Cool trauma dump. Anyway…",
    "Nope. We're not doing feelings today.",
    "That looked suspiciously introspective.",
    "You almost had a breakthrough. Gross.",
    "This isn't therapy, bestie.",
    "bruh?",
    "Oop—too real.",
    "I'm just here for vibes, not your backstory.",
    "Wow, okay. Didn't ask for depth.",
    "Don't get emotional. This is a quiz, not a memoir.",
    "I'm scared now.",
    "Oh no, you were about to be vulnerable.",
    "Loving the overshare. Moving on.",
    "That looked dangerously self-aware.",
    "Okay Dr. Phil, relax.",
    "This isn't that kind of app.",
    "We don't process things here.",
    "That's a journal thought. Next.",
    "Wow. Let's... not unpack that.",
    "Big yikes. Big skip.",
    "nah",
    "And...that's enough honesty for one day.",
    "Save it for your group chat.",
    "I'm gonna pretend I didn't see that.",
    "Absolutely not.",
    "You lost me.",
    "Can't relate.",
    "What are you, self-aware or something?",
    "Delete that."
  ];

  const prompts = {
    name: "> what should we call you?\n\n> ",
    age: "> how old are you?\n\n> ",
    gender: "> what's your gender?\n\n> ",
    random: `> ${randomQuestion}\n\n> `
  };

  const currentPrompt = prompts[currentField];

  const handleExit = () => {
    navigate('/');
  };

  // Set random question when component mounts
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * randomQuestions.length);
    setRandomQuestion(randomQuestions[randomIndex]);
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!promptComplete) return;
      
      // Prevent Enter when input is locked (random question timer)
      if (e.key === "Enter" && inputLocked && currentField === 'random') {
        return;
      }
      
      if (e.key === "Enter") {
        if (currentInput.trim()) {
          let finalValue = currentInput.trim();
          
          // Validate age is a number
          if (currentField === 'age') {
            if (!/^\d+$/.test(currentInput.trim())) {
              setShowError(true);
              setTimeout(() => {
                setShowError(false);
                setCurrentInput("");
              }, 2000);
              return;
            }
          }
          
          // Handle gender shortcuts
          if (currentField === 'gender') {
            const input = currentInput.toLowerCase().trim();
            console.log('Gender field - input:', input, 'currentField:', currentField);
            if (input === 'm') {
              finalValue = 'male';
              console.log('Expanded m to male');
            } else if (input === 'f') {
              finalValue = 'female';
              console.log('Expanded f to female');
            } else if (input === 'o') {
              finalValue = 'other';
              console.log('Expanded o to other');
            }
          }

          // Trigger bump animation
          setBump(true);
          setTimeout(() => setBump(false), 300);

          const newUserInfo = { ...userInfo, [currentField === 'random' ? 'randomAnswer' : currentField]: finalValue };
          setUserInfo(newUserInfo);
          setCurrentInput("");
          setPromptComplete(false);
          
          // Reset timer states when moving to next field
          setTimerActive(false);
          setInputLocked(false);
          setShowSarcasm(false);

          // Move to next field or complete
          if (currentField === 'name') {
            setCurrentField('age');
          } else if (currentField === 'age') {
            setCurrentField('gender');
          } else if (currentField === 'gender') {
            setCurrentField('random');
          } else {
            // All fields complete
            setTimeout(() => onComplete(newUserInfo), 500);
          }
        }
      } else if (e.key === "Backspace") {
        if (!inputLocked) {
          setCurrentInput(prev => prev.slice(0, -1));
          setShowError(false);
        }
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
        if (!inputLocked) {
          // Start timer on first character for random question
          if (currentField === 'random' && currentInput === "" && !timerActive) {
            setTimerActive(true);
            setTimeout(() => {
              setInputLocked(true);
              const randomIndex = Math.floor(Math.random() * sarcasmResponses.length);
              setSarcasmText(sarcasmResponses[randomIndex]);
              setShowSarcasm(true);
              
              // Show loading message after sarcasm, then complete
              setTimeout(() => {
                setShowLoading(true);
                setTimeout(() => {
                  const newUserInfo = { ...userInfo, randomAnswer: currentInput.trim() };
                  onComplete(newUserInfo);
                }, 2000);
              }, 1500);
            }, 2000);
          }
          
          setCurrentInput(prev => prev + e.key);
          setShowError(false);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [promptComplete, currentInput, currentField, userInfo, onComplete, randomQuestion, inputLocked, timerActive, sarcasmResponses]);

  return (
    <div className="min-h-screen bg-black text-terminal-light p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Terminal with outline */}
        <motion.div 
          className="border border-terminal-accent/50 rounded-lg p-6 bg-black/80"
          animate={bump ? { y: [-2, 0], scale: [1, 1.005, 1] } : {}}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {/* Terminal header */}
          <div className="flex items-center mb-6 pb-4 border-b border-terminal-accent/30">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <div 
                  className="w-3 h-3 rounded-full bg-red-500 mr-2 cursor-pointer hover:bg-red-400 transition-colors"
                  title="exit/restart"
                />
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-black border border-terminal-accent/50 text-terminal-light">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-terminal-light">Exit User Registration?</AlertDialogTitle>
                  <AlertDialogDescription className="text-terminal-light/70">
                    Are you sure you want to exit? Your progress will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel className="bg-transparent border border-terminal-accent/50 text-terminal-light hover:bg-terminal-accent/10">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction 
                    onClick={handleExit}
                    className="bg-red-500 text-white hover:bg-red-600"
                  >
                    Exit
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="ml-4 text-terminal-accent/70 text-sm">user_registration.exe</span>
          </div>
          
          {/* Terminal content */}
          <div className="space-y-2">
            {/* Show completed fields */}
            {userInfo.name && (
              <div className="text-left text-terminal-light/70">
                {`> name: ${userInfo.name}`}
              </div>
            )}
            {userInfo.age && (
              <div className="text-left text-terminal-light/70">
                {`> age: ${userInfo.age}`}
              </div>
            )}
            {userInfo.gender && (
              <div className="text-left text-terminal-light/70">
                {`> gender: ${userInfo.gender}`}
              </div>
            )}
            {userInfo.randomAnswer && (
              <div className="text-left text-terminal-light/70">
                {`> answer: ${userInfo.randomAnswer}`}
              </div>
            )}
            
            {/* Current prompt and input on same line */}
            <div className="text-left">
              <AnimatedText
                text={currentPrompt}
                speed={30}
                className="text-terminal-light whitespace-pre-line inline"
                onComplete={() => setPromptComplete(true)}
              />
              {promptComplete && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="inline"
                >
                  <span className={inputLocked && currentField === 'random' ? "text-red-400" : "text-terminal-light"}>
                    {currentInput}
                  </span>
                  <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 animate-pulse"></span>
                </motion.span>
              )}
            </div>
            
            {/* Show sarcastic response */}
            {showSarcasm && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left mt-2"
              >
                <AnimatedText
                  text={sarcasmText}
                  speed={20}
                  className="text-terminal-accent/70 text-left"
                />
              </motion.div>
            )}
            
            {/* Show loading message */}
            {showLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-left mt-2"
              >
                <AnimatedText
                  text="loading personality analysis..."
                  speed={30}
                  className="text-terminal-light/70 text-left"
                />
              </motion.div>
            )}
            
            {showError && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 mt-4 text-left"
              >
                <AnimatedText
                  text={currentField === 'age' ? "please enter a valid number" : "invalid input"}
                  speed={20}
                  className="text-red-400 text-left"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UserInfoForm;