export const topics = [
  {
    id: 1,
    title: "Explain fractions to a 9-year-old",
    description: "Help a young student understand what fractions are using simple words and examples."
  },
  {
    id: 2,
    title: "How would you teach a student that 0.5 = 1/2?",
    description: "Show the relationship between decimals and fractions in a way that makes sense."
  },
  {
    id: 3,
    title: "A student says 'I hate math.' What do you do?",
    description: "Handle this emotional response with empathy and turn it around."
  },
  {
    id: 4,
    title: "Explain why 2 + 2 = 4 to someone who's never heard of numbers",
    description: "Start from absolute zero — no assumptions about prior knowledge."
  },
  {
    id: 5,
    title: "How would you help a student who's been staring at a problem for 5 minutes?",
    description: "They seem stuck. What do you do?"
  },
  {
    id: 6,
    title: "Explain multiplication to someone who only knows addition",
    description: "Build on what they know to introduce something new."
  },
  {
    id: 7,
    title: "A student got the same question wrong 3 times. How do you help?",
    description: "They're getting frustrated. How do you handle this?"
  },
  {
    id: 8,
    title: "Explain the concept of 'negative numbers' to a 5th grader",
    description: "Make sense of numbers less than zero."
  },
  {
    id: 9,
    title: "How would you make fractions less scary for a struggling student?",
    description: "Fractions can be intimidating. How do you make them approachable?"
  },
  {
    id: 10,
    title: "A student asks 'When will I ever use this in real life?' — your response?",
    description: "Answer this common question in a way that inspires."
  }
]

export const getRandomTopic = () => {
  const randomIndex = Math.floor(Math.random() * topics.length)
  return topics[randomIndex]
}
