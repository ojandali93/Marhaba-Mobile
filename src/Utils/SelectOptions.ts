const traitsAndHobbies = [
  "Exploring Cafés",
  "Ambitious",
  "Photography",
  "Gaming",
  "Family-Oriented",
  "Attending Events",
  "Funny / Witty",
  "Tech Enthusiast",
  "Clean & Organized",
  "Fashion & Style",
  "Cooking",
  "Optimistic",
  "Open-Minded",
  "Adventurous",
  "Animal Lover",
  "Reading",
  "Traveling",
  "Car Enthusiast",
  "Writing",
  "Introvert",
  "Extrovert",
  "Volunteering",
  "Music Lover",
  "Deep Thinker",
  "Watching Movies",
  "Dancing",
  "Coffee Addict",
  "Faith-Centered",
  "Playing Sports",
  "Traditional",
  "Hiking & Nature",
  "DIY Projects",
  "Working Out",
  "Calm & Grounded",
  "Art & Design",
  "Shopping",
  "Gardening",
  "Golf"
];

const eitherOrQuestions = [
  {
    question: "On a Friday night, I’d rather...",
    options: ["Stay in", "Go out"]
  },
  {
    question: "My energy level is usually...",
    options: ["Chill & lowkey", "High & active"]
  },
  {
    question: "I prefer to plan...",
    options: ["Everything", "Go with the flow"]
  },
  {
    question: "I’m more of a...",
    options: ["Morning person", "Night owl"]
  },
  {
    question: "In social situations, I...",
    options: ["Big groups", "Small circles"]
  },
  {
    question: "I’m more...",
    options: ["Introverted", "Extroverted"]
  },
  {
    question: "Pineapple on pizza?",
    options: ["Yes, please 🍍🍕", "Never ever 🙅‍♂️"]
  },
  {
    question: "I’d rather give up...",
    options: ["Coffee", "Social media"]
  },
  {
    question: "Texting vs Calling",
    options: ["Text me", "Call me"]
  },
  {
    question: "Do you believe in love at first sight?",
    options: ["Absolutely", "Not really"]
  },
  {
    question: "In the morning, I...",
    options: ["Wake up early", "Hit snooze 5 times"]
  },
  {
    question: "When traveling, I prefer...",
    options: ["Adventure", "Relaxation"]
  },
  {
    question: "I like my food...",
    options: ["Spicy 🌶️", "Mild 🧂"]
  },
  {
    question: "When making decisions...",
    options: ["Think with logic", "Go with feelings"]
  },
  {
    question: "I usually arrive...",
    options: ["Early", "Right on time"]
  },
  {
    question: "I value more in a partner...",
    options: ["Ambition", "Empathy"]
  },
  {
    question: "Would you move for love?",
    options: ["Yes", "No"]
  },
  {
    question: "Do opposites attract?",
    options: ["Definitely", "Not really"]
  },
  {
    question: "Is it okay to ghost someone?",
    options: ["Never", "Sometimes, yes"]
  },
  {
    question: "Long-distance relationships can work?",
    options: ["Yes", "No"]
  }
];

const faqs = [
  {
    question: "What is Marhaba?",
    answer: "Marhaba is a relationship-focused app built for Arabs looking to find meaningful connections, friendships, and marriage."
  },
  {
    question: "Is Marhaba only for Muslims?",
    answer: "No — while many of our users are Muslim, Marhaba is open to all Arabs who are looking for culturally-aligned relationships."
  },
  {
    question: "How does Marhaba match users?",
    answer: "We use compatibility-based algorithms that take into account values, intentions, lifestyle, and preferences — not just location or looks."
  },
  {
    question: "Is my profile visible to everyone?",
    answer: "By default, your profile is visible to others who match your filters. You can control your visibility in your settings."
  },
  {
    question: "Can I hide my profile?",
    answer: "Yes, you can temporarily hide your profile from the Feed in the Visibility settings."
  },
  {
    question: "What happens when I like someone?",
    answer: "If they like you back, it becomes a match! You’ll then be able to message each other inside the app."
  },
  {
    question: "Is Marhaba free?",
    answer: "Yes, Marhaba is free to use. We also offer a Pro version with extra features like more likes, advanced filters, and priority exposure."
  },
  {
    question: "How do I report a user?",
    answer: "Go to their profile, tap the three dots at the top right, and select 'Report'. You can choose a reason and we’ll take it from there."
  },
  {
    question: "How do I delete my account?",
    answer: "Go to Settings → Account → Delete Account. Once deleted, your data will be removed permanently."
  },
  {
    question: "What makes Marhaba different from other dating apps?",
    answer: "We prioritize compatibility, intention, and cultural understanding — not just swiping. We’re here to help you build something real."
  }
];

const heightsOptions = [
  '4\'0"',
  '4\'1"',
  '4\'2"',
  '4\'3"',
  '4\'4"',
  '4\'5"',
  '4\'6"',
  '4\'7"',
  '4\'8"',
  '4\'9"',
  '4\'10"',
  '4\'11"',
  '5\'0"',
  '5\'1"',
  '5\'2"',
  '5\'3"',
  '5\'4"',
  '5\'5"',
  '5\'6"',
  '5\'7"',
  '5\'8"',
  '5\'9"',
  '5\'10"',
  '5\'11"',
  '6\'0"',
  '6\'1"',
  '6\'2"',
  '6\'3"',
  '6\'4"',
  '6\'5"',
  '6\'6"',
  '6\'7"',
  '6\'8"',
  '6\'9"',
  '6\'10"',
  '6\'11"',
  '7\'0"',
];

const lookingForOptions = [
  'Friendship',
  'Connect with Community',
  'Something Serious',
  'Marriage',
]

const timelineOptions = [
  'As soon as possible',
  'Within 6–12 months',
  'In 1–2 years',
  'In 3–5 years',
  'Not sure yet',
  'When the time feels right',
];

const backgroundOptions = [
  // 🌍 Middle Eastern countries (in region-specific order)
  'Bahrain',
  'Cyprus',
  'Egypt',
  'Iran',
  'Iraq',
  'Israel',
  'Jordan',
  'Kuwait',
  'Lebanon',
  'Oman',
  'Palestine',
  'Qatar',
  'Saudi Arabia',
  'Syria',
  'Turkey',
  'United Arab Emirates',
  'Yemen',

  // 🌍 All other countries (alphabetical)
  'Afghanistan',
  'Albania',
  'Algeria',
  'Andorra',
  'Angola',
  'Antigua and Barbuda',
  'Argentina',
  'Armenia',
  'Australia',
  'Austria',
  'Azerbaijan',
  'Bahamas',
  'Bangladesh',
  'Barbados',
  'Belarus',
  'Belgium',
  'Belize',
  'Benin',
  'Bhutan',
  'Bolivia',
  'Bosnia and Herzegovina',
  'Botswana',
  'Brazil',
  'Brunei',
  'Bulgaria',
  'Burkina Faso',
  'Burundi',
  'Cabo Verde',
  'Cambodia',
  'Cameroon',
  'Canada',
  'Central African Republic',
  'Chad',
  'Chile',
  'China',
  'Colombia',
  'Comoros',
  'Congo (Brazzaville)',
  'Congo (Kinshasa)',
  'Costa Rica',
  'Croatia',
  'Cuba',
  'Czech Republic',
  'Denmark',
  'Djibouti',
  'Dominica',
  'Dominican Republic',
  'Ecuador',
  'El Salvador',
  'Equatorial Guinea',
  'Eritrea',
  'Estonia',
  'Eswatini',
  'Ethiopia',
  'Fiji',
  'Finland',
  'France',
  'Gabon',
  'Gambia',
  'Georgia',
  'Germany',
  'Ghana',
  'Greece',
  'Grenada',
  'Guatemala',
  'Guinea',
  'Guinea-Bissau',
  'Guyana',
  'Haiti',
  'Honduras',
  'Hungary',
  'Iceland',
  'India',
  'Indonesia',
  'Ireland',
  'Italy',
  'Ivory Coast',
  'Jamaica',
  'Japan',
  'Kazakhstan',
  'Kenya',
  'Kiribati',
  'Korea, North',
  'Korea, South',
  'Kosovo',
  'Kyrgyzstan',
  'Laos',
  'Latvia',
  'Lesotho',
  'Liberia',
  'Libya',
  'Liechtenstein',
  'Lithuania',
  'Luxembourg',
  'Madagascar',
  'Malawi',
  'Malaysia',
  'Maldives',
  'Mali',
  'Malta',
  'Marshall Islands',
  'Mauritania',
  'Mauritius',
  'Mexico',
  'Micronesia',
  'Moldova',
  'Monaco',
  'Mongolia',
  'Montenegro',
  'Morocco',
  'Mozambique',
  'Myanmar',
  'Namibia',
  'Nauru',
  'Nepal',
  'Netherlands',
  'New Zealand',
  'Nicaragua',
  'Niger',
  'Nigeria',
  'North Macedonia',
  'Norway',
  'Pakistan',
  'Panama',
  'Papua New Guinea',
  'Paraguay',
  'Peru',
  'Philippines',
  'Poland',
  'Portugal',
  'Romania',
  'Russia',
  'Rwanda',
  'Saint Kitts and Nevis',
  'Saint Lucia',
  'Saint Vincent and the Grenadines',
  'Samoa',
  'San Marino',
  'São Tomé and Príncipe',
  'Senegal',
  'Serbia',
  'Seychelles',
  'Sierra Leone',
  'Singapore',
  'Slovakia',
  'Slovenia',
  'Solomon Islands',
  'Somalia',
  'South Africa',
  'South Sudan',
  'Spain',
  'Sri Lanka',
  'Sudan',
  'Suriname',
  'Sweden',
  'Switzerland',
  'Tajikistan',
  'Tanzania',
  'Thailand',
  'Timor-Leste',
  'Togo',
  'Tonga',
  'Trinidad and Tobago',
  'Tunisia',
  'Turkmenistan',
  'Tuvalu',
  'Uganda',
  'Ukraine',
  'United Kingdom',
  'United States',
  'Uruguay',
  'Uzbekistan',
  'Vanuatu',
  'Vatican City',
  'Venezuela',
  'Vietnam',
  'Zambia',
  'Zimbabwe',
];

const religionOptions = [
  'Islam',
  'Christianity',
  'Judaism',
  'Hinduism',
  'Buddhism',
  'Sikhism',
  'Atheism',
  'Agnostic',
  'Spiritual',
  'Other',
  'Prefer not to say',
];

const religiousSectOptions = [
  'Sunni',
  'Shia',
  'Ibadi',
  'Ahmadi',
  'Sufi',
  'Other (Islam)',
  'Catholic',
  'Protestant',
  'Orthodox (Eastern)',
  'Evangelical',
  'Anglican',
  'Lutheran',
  'Baptist',
  'Methodist',
  'Pentecostal',
  'Coptic',
  'Other (Christianity)',
  'Orthodox',
  'Conservative',
  'Reform',
  'Reconstructionist',
  'Hasidic',
  'Secular',
  'Other (Judaism)',
  'Vaishnavism',
  'Shaivism',
  'Shaktism',
  'Smartism',
  'Theravāda',
  'Mahayāna',
  'Vajrayāna (Tibetan)',
  'Zen',
  'Nichiren',
  'Pure Land',
  'Other (Buddhism)',
  'Khalsa',
  'Nanakpanthi',
  'Namdhari',
  'Nirmala',
  'Other (Sikhism)',
  'Baháʼí Faith',
  'Druze',
  'Unitarian Universalist',
  'Pagan',
  'Wiccan',
  'Spiritual but not religious',
  'Agnostic',
  'Atheist',
  'Other',
  'Prefer not to say',
];

const religiousViewsOptions = [
  'Very Practicing',
  'Practicing',
  'Somewhat Practicing',
  'Spiritual but not practicing',
  'Not practicing',
  'Prefer not to say',
];

export const tutorialScreens = [
  {
    key: 'welcome',
    title: 'Welcome to Marhaba',
    description: 'Quickly view profiles that match your preferences. Like, Superlike, or Dislike to keep swiping.',
    icon: require('../Assets/marhaba-icon-full-beige.png'), // Or use react-native-vector-icons
  },
  {
    key: 'feed',
    title: 'Feed',
    description: 'Quickly view profiles that match your preferences. Like, Superlike, or Dislike to keep swiping.',
    icon: 'Home', // Or use react-native-vector-icons
  },
  {
    key: 'likes',
    title: 'Likes',
    description: 'See who liked or superliked you. Pro+ users can unblur and view profiles directly.',
    icon: 'Heart',
  },
  {
    key: 'recommended',
    title: 'Recommended',
    description: 'Search profiles using filters. Pro users get access to compatibility-based recommendations.',
    icon: 'Zap',
  },
  {
    key: 'chat',
    title: 'Chat',
    description: 'Start conversations with users after you both match. Keep it kind and meaningful.',
    icon: 'MessageSquare',
  },
  {
    key: 'profile',
    title: 'Profile',
    description: 'Manage your profile, photos, visibility, settings, and more.',
    icon: 'User',
  },
  {
    key: 'enjoy',
    title: 'Enjoy',
    description: 'Time for you to enjoy Marhabah and find your perfect match!',
    icon: 'ThumbsUp',
  },
];



module.exports = {traitsAndHobbies, eitherOrQuestions, faqs, heightsOptions, lookingForOptions, timelineOptions, backgroundOptions, religionOptions, religiousSectOptions, religiousViewsOptions, tutorialScreens }