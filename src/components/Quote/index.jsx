import React, { useEffect, useState } from 'react';
import { Box, Text } from '@chakra-ui/react';

const localQuotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Success is not in what you have, but who you are.", author: "Bo Bennett" },
  { text: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
  { text: "Your time is limited, don’t waste it living someone else’s life.", author: "Steve Jobs" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "Start where you are. Use what you have. Do what you can.", author: "Arthur Ashe" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "Everything you’ve ever wanted is on the other side of fear.", author: "George Addair" },
  { text: "Push yourself, because no one else is going to do it for you.", author: "Unknown" },
  { text: "Hardships often prepare ordinary people for an extraordinary destiny.", author: "C.S. Lewis" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Believe in yourself and all that you are.", author: "Christian D. Larson" },
  { text: "It does not matter how slowly you go as long as you do not stop.", author: "Confucius" },
  { text: "Act as if what you do makes a difference. It does.", author: "William James" },
  { text: "Success usually comes to those who are too busy to be looking for it.", author: "Henry David Thoreau" },
  { text: "Don’t be afraid to give up the good to go for the great.", author: "John D. Rockefeller" },
  { text: "I find that the harder I work, the more luck I seem to have.", author: "Thomas Jefferson" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "The best revenge is massive success.", author: "Frank Sinatra" },
  { text: "What you get by achieving your goals is not as important as what you become by achieving your goals.", author: "Zig Ziglar" }
];


const Quote = () => {
  const [quote, setQuote] = useState(null);

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * localQuotes.length);
    setQuote(localQuotes[randomIndex]);
  }, []);

  if (!quote) {
    return (
      <Box textAlign="center" p={4}>
        <Text>Loading quote...</Text>
      </Box>
    );
  }

  return (
    <Box
      p={5}
      display="flex"
      flexDirection="column"
      alignItems="flex-start"
      maxW="800px"
    >
      <Text
  fontWeight="bold"
  fontStyle="italic"
  fontSize="2xl" // or use '3xl' or '4xl' for even larger text
  textAlign="center"
  mb={2}
>
  “{quote.text}”
</Text>
<Text fontWeight="semibold" fontSize="lg" textAlign="center" color="gray.600">
  — {quote.author}
</Text>

    </Box>
  );
};

export default Quote;




