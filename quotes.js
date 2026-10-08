/*
 * Live & Enjoy quote list.
 *
 * Every entry has:
 *   en       English text (use \n for line breaks in poems)
 *   zh       Traditional Chinese (Hong Kong style). For Chinese classics this is the original text.
 *   author   Author / speaker in English
 *   authorZh Author / speaker in Traditional Chinese
 *   source   Work, year and translator where relevant
 *   kind     "real"     = a documented quote from a named person, book, poem or film
 *            "original" = an original line written for this app, credited to "Live & Enjoy"
 *
 * To keep the rotation fair, add new quotes at the END of the list (see README.md).
 */
(function (root) {
  var QUOTES = [
    // ---------- Real, documented quotes ----------
    {
      en: "I went to the woods because I wished to live deliberately, to front only the essential facts of life, and see if I could not learn what it had to teach, and not, when I came to die, discover that I had not lived.",
      zh: "我到林中去，是因為我希望從容而清醒地生活，只面對生活中最基本的事實，看看能否學到生活要教我的東西，免得臨終時才發現自己從未真正活過。",
      author: "Henry David Thoreau", authorZh: "梭羅", source: "Walden (1854)", kind: "real"
    },
    {
      en: "Time is but the stream I go a-fishing in.",
      zh: "時間不過是我去垂釣的那條小溪。",
      author: "Henry David Thoreau", authorZh: "梭羅", source: "Walden (1854)", kind: "real"
    },
    {
      en: "Our life is frittered away by detail. … Simplicity, simplicity, simplicity!",
      zh: "我們的生命，被瑣碎小事一點一點消磨掉……簡單，簡單，再簡單！",
      author: "Henry David Thoreau", authorZh: "梭羅", source: "Walden (1854)", kind: "real"
    },
    {
      en: "Tell me, what is it you plan to do\nwith your one wild and precious life?",
      zh: "告訴我，你打算怎樣度過\n你這獨一無二、狂野而珍貴的一生？",
      author: "Mary Oliver", authorZh: "瑪莉·奧利弗", source: "“The Summer Day” (1990)", kind: "real"
    },
    {
      en: "You do not have to be good.\n…\nYou only have to let the soft animal of your body\nlove what it loves.",
      zh: "你不必十全十美。\n……\n你只需讓身體裡那隻溫柔的小動物，\n去愛它所愛的。",
      author: "Mary Oliver", authorZh: "瑪莉·奧利弗", source: "“Wild Geese” (1986)", kind: "real"
    },
    {
      en: "Instructions for living a life:\nPay attention.\nBe astonished.\nTell about it.",
      zh: "生活指南：\n留心觀察。\n為之驚歎。\n說給人聽。",
      author: "Mary Oliver", authorZh: "瑪莉·奧利弗", source: "“Sometimes”, Red Bird (2008)", kind: "real"
    },
    {
      en: "How we spend our days is, of course, how we spend our lives.",
      zh: "我們怎樣過每一天，當然就是怎樣過這一生。",
      author: "Annie Dillard", authorZh: "安妮·迪勒", source: "The Writing Life (1989)", kind: "real"
    },
    {
      en: "Life moves pretty fast. If you don't stop and look around once in a while, you could miss it.",
      zh: "人生過得很快。如果你不偶爾停下來四處看看，可能就會錯過了。",
      author: "Ferris Bueller", authorZh: "費瑞斯·布勒", source: "Ferris Bueller's Day Off (1986), written by John Hughes", kind: "real"
    },
    {
      en: "It is not that we have a short time to live, but that we waste a lot of it.",
      zh: "不是我們的生命太短，而是我們浪費了太多。",
      author: "Seneca", authorZh: "塞內卡", source: "On the Shortness of Life (trans. C. D. N. Costa)", kind: "real"
    },
    {
      en: "Life is long if you know how to use it.",
      zh: "懂得善用，人生其實很長。",
      author: "Seneca", authorZh: "塞內卡", source: "On the Shortness of Life (trans. C. D. N. Costa)", kind: "real"
    },
    {
      en: "The greatest obstacle to living is expectancy, which hangs upon tomorrow and loses today.",
      zh: "生活最大的障礙是期待：它寄望於明天，卻失去了今天。",
      author: "Seneca", authorZh: "塞內卡", source: "On the Shortness of Life (trans. C. D. N. Costa)", kind: "real"
    },
    {
      en: "Hold every hour in your grasp. Lay hold of to-day's task, and you will not need to depend so much upon to-morrow's. While we are postponing, life speeds by.",
      zh: "把握每一個小時。抓緊今天的事，就不必那麼依賴明天。我們一拖再拖，人生就飛快溜走。",
      author: "Seneca", authorZh: "塞內卡", source: "Moral Letters to Lucilius, Letter 1 (trans. Richard M. Gummere)", kind: "real"
    },
    {
      en: "…very little indeed is necessary for living a happy life.",
      zh: "……要活得快樂，其實所需甚少。",
      author: "Marcus Aurelius", authorZh: "馬可·奧理略", source: "Meditations (trans. George Long)", kind: "real"
    },
    {
      en: "…every man lives only this present time, which is an indivisible point, and … all the rest of his life is either past or it is uncertain.",
      zh: "……每個人只活在當下這一刻，那是不可分割的一點；其餘的人生，不是已經過去，就是還未可知。",
      author: "Marcus Aurelius", authorZh: "馬可·奧理略", source: "Meditations (trans. George Long)", kind: "real"
    },
    {
      en: "Seize the day, trusting as little as possible in tomorrow.",
      zh: "把握今天，盡量少寄望明天。",
      author: "Horace", authorZh: "賀拉斯", source: "Odes I.11, “carpe diem, quam minimum credula postero” (translated)", kind: "real"
    },
    {
      en: "For my part, I travel not to go anywhere, but to go. I travel for travel's sake. The great affair is to move.",
      zh: "對我來說，旅行不是為了去某個地方，而是為了出發。我為旅行而旅行，最要緊的是動起來。",
      author: "Robert Louis Stevenson", authorZh: "史蒂文森", source: "Travels with a Donkey in the Cévennes (1879)", kind: "real"
    },
    {
      en: "To live is the rarest thing in the world. Most people exist, that is all.",
      zh: "真正活著，是世上最罕有的事。大多數人只是存在而已。",
      author: "Oscar Wilde", authorZh: "王爾德", source: "The Soul of Man under Socialism (1891)", kind: "real"
    },
    {
      en: "Life is either a daring adventure, or nothing.",
      zh: "人生若不是一場大膽的冒險，便甚麼都不是。",
      author: "Helen Keller", authorZh: "海倫·凱勒", source: "The Open Door (1957)", kind: "real"
    },
    {
      en: "All we have to decide is what to do with the time that is given us.",
      zh: "我們唯一要決定的，是怎樣運用給予我們的時間。",
      author: "J. R. R. Tolkien (Gandalf)", authorZh: "托爾金（甘道夫）", source: "The Fellowship of the Ring (1954)", kind: "real"
    },
    {
      en: "It's a dangerous business, Frodo, going out of your door. You step into the Road, and if you don't keep your feet, there is no knowing where you might be swept off to.",
      zh: "佛羅多，踏出家門是件危險的事。你一踏上路，如果站不穩腳，誰也不知道你會被帶到哪裡去。",
      author: "J. R. R. Tolkien (Bilbo)", authorZh: "托爾金（比爾博）", source: "The Fellowship of the Ring (1954)", kind: "real"
    },
    {
      en: "Not all those who wander are lost.",
      zh: "流浪的人，未必都迷了路。",
      author: "J. R. R. Tolkien", authorZh: "托爾金", source: "The Fellowship of the Ring (1954)", kind: "real"
    },
    {
      en: "I urge you to please notice when you are happy, and exclaim or murmur or think at some point, “If this isn't nice, I don't know what is.”",
      zh: "我懇請你，快樂的時候要留意到，並且在某一刻大聲說、輕聲說或在心裡想：「如果這還不算美好，我真不知道甚麼才算。」",
      author: "Kurt Vonnegut", authorZh: "馮內果", source: "A Man Without a Country (2005)", kind: "real"
    },
    {
      en: "I loafe and invite my soul,\nI lean and loafe at my ease observing a spear of summer grass.",
      zh: "我悠悠閒閒，邀請我的靈魂，\n我自在地倚著、閒著，看一片夏日的草葉。",
      author: "Walt Whitman", authorZh: "惠特曼", source: "“Song of Myself”, Leaves of Grass", kind: "real"
    },
    {
      en: "To see a World in a Grain of Sand\nAnd a Heaven in a Wild Flower,\nHold Infinity in the palm of your hand\nAnd Eternity in an hour.",
      zh: "一沙一世界，\n一花一天堂。\n掌中握無限，\n剎那即永恆。",
      author: "William Blake", authorZh: "布萊克", source: "“Auguries of Innocence”", kind: "real"
    },
    {
      en: "A thing of beauty is a joy for ever:\nIts loveliness increases; it will never\nPass into nothingness",
      zh: "美好的事物是永恆的喜悅：\n它的可愛與日俱增，永遠不會\n化為烏有",
      author: "John Keats", authorZh: "濟慈", source: "Endymion (1818)", kind: "real"
    },
    {
      en: "And then my heart with pleasure fills,\nAnd dances with the daffodils.",
      zh: "於是我的心充滿歡愉，\n和水仙花一同起舞。",
      author: "William Wordsworth", authorZh: "華茲華斯", source: "“I Wandered Lonely as a Cloud”", kind: "real"
    },
    {
      en: "Gather ye rosebuds while ye may,\nOld Time is still a-flying …",
      zh: "玫瑰花蕾，趁早採擷，\n時光依舊在飛逝……",
      author: "Robert Herrick", authorZh: "赫里克", source: "“To the Virgins, to Make Much of Time” (1648)", kind: "real"
    },
    {
      en: "That it will never come again\nIs what makes life so sweet.",
      zh: "正因為它不會再來，\n人生才如此甜美。",
      author: "Emily Dickinson", authorZh: "艾蜜莉·狄金森", source: "Poem “That it will never come again”", kind: "real"
    },
    {
      en: "“Hope” is the thing with feathers –\nThat perches in the soul –",
      zh: "「希望」是長著羽毛的東西——\n棲息在靈魂裡——",
      author: "Emily Dickinson", authorZh: "艾蜜莉·狄金森", source: "“Hope” is the thing with feathers", kind: "real"
    },
    {
      en: "Is it not pleasant to learn with a constant perseverance and application? Is it not delightful to have friends coming from distant quarters?",
      zh: "學而時習之，不亦說乎？有朋自遠方來，不亦樂乎？",
      author: "Confucius", authorZh: "孔子", source: "The Analects, Book I (trans. James Legge) ·《論語·學而》", kind: "real"
    },
    {
      en: "With coarse rice to eat, with water to drink, and my bended arm for a pillow; I have still joy in the midst of these things.",
      zh: "飯疏食飲水，曲肱而枕之，樂亦在其中矣。",
      author: "Confucius", authorZh: "孔子", source: "The Analects, Book VII (trans. James Legge) ·《論語·述而》", kind: "real"
    },
    {
      en: "Bamboo staff and straw sandals, lighter than a horse. Who's afraid? In a straw cape, I'll take whatever mist and rain life brings.",
      zh: "竹杖芒鞋輕勝馬，誰怕？一蓑煙雨任平生。",
      author: "Su Shi", authorZh: "蘇軾", source: "《定風波》(English translation for this app)", kind: "real"
    },
    {
      en: "The true flavour of life is found in simple, quiet joys.",
      zh: "人間有味是清歡。",
      author: "Su Shi", authorZh: "蘇軾", source: "《浣溪沙》(English translation for this app)", kind: "real"
    },
    {
      en: "When life goes your way, enjoy it to the full; never leave the golden cup to face the moon empty.",
      zh: "人生得意須盡歡，莫使金樽空對月。",
      author: "Li Bai", authorZh: "李白", source: "《將進酒》(English translation for this app)", kind: "real"
    },
    {
      en: "Picking chrysanthemums by the eastern fence, I catch sight, at ease, of the southern hills.",
      zh: "採菊東籬下，悠然見南山。",
      author: "Tao Yuanming", authorZh: "陶淵明", source: "《飲酒·其五》(English translation for this app)", kind: "real"
    },
    {
      en: "I walk to where the stream runs out, then sit and watch the clouds rise.",
      zh: "行到水窮處，坐看雲起時。",
      author: "Wang Wei", authorZh: "王維", source: "《終南別業》(English translation for this app)", kind: "real"
    },
    {
      en: "Sleeping in on a spring morning, I never noticed the dawn; everywhere, I hear birds singing.",
      zh: "春眠不覺曉，處處聞啼鳥。",
      author: "Meng Haoran", authorZh: "孟浩然", source: "《春曉》(English translation for this app)", kind: "real"
    },
    {
      en: "Looking up at the vastness of the universe, looking down at the abundance of living things, we let our eyes roam and our hearts run free, delighting sight and sound to the full. Truly, this is joy.",
      zh: "仰觀宇宙之大，俯察品類之盛，所以遊目騁懷，足以極視聽之娛，信可樂也。",
      author: "Wang Xizhi", authorZh: "王羲之", source: "《蘭亭集序》(English translation for this app)", kind: "real"
    },
    {
      en: "Rest is not idleness, and to lie sometimes on the grass under trees on a summer's day, listening to the murmur of the water, or watching the clouds float across the sky, is by no means a waste of time.",
      zh: "休息不是懶惰。夏日裡偶爾躺在樹下的草地上，聽聽流水潺潺，看看白雲飄過天空，絕對不是浪費時間。",
      author: "John Lubbock", authorZh: "約翰·盧伯克", source: "The Use of Life (1894)", kind: "real"
    },
    {
      en: "Breathing in, I calm my body. Breathing out, I smile. Dwelling in the present moment, I know this is a wonderful moment.",
      zh: "吸氣，我平靜身體。呼氣，我微笑。安住當下，我知道這是美妙的一刻。",
      author: "Thich Nhat Hanh", authorZh: "一行禪師", source: "Peace Is Every Step (1991)", kind: "real"
    },
    {
      en: "I arise in the morning torn between a desire to improve (or save) the world and a desire to enjoy (or savor) the world. This makes it hard to plan the day.",
      zh: "每天早上起床，我都在兩種渴望之間拉扯：想改善（或拯救）這個世界，又想享受（或細味）這個世界。這令我很難計劃一天。",
      author: "E. B. White", authorZh: "E. B. 懷特", source: "Interview, The New York Times (1969)", kind: "real"
    },
    {
      en: "Summer afternoon—summer afternoon; to me those have always been the two most beautiful words in the English language.",
      zh: "夏日午後——夏日午後；對我來說，這一直是英語裡最美的兩個詞。",
      author: "Henry James", authorZh: "亨利·詹姆斯", source: "As recalled by Edith Wharton, A Backward Glance (1934)", kind: "real"
    },
    {
      en: "To finish the moment, to find the journey's end in every step of the road, to live the greatest number of good hours, is wisdom.",
      zh: "活好每一刻，在路上的每一步都找到旅程的終點，盡量多過美好的時光，這就是智慧。",
      author: "Ralph Waldo Emerson", authorZh: "愛默生", source: "“Experience”, Essays: Second Series (1844)", kind: "real"
    },
    {
      en: "Write it on your heart that every day is the best day in the year.",
      zh: "把這句話刻在心上：每一天，都是一年之中最好的一天。",
      author: "Ralph Waldo Emerson", authorZh: "愛默生", source: "“Works and Days”, Society and Solitude (1870)", kind: "real"
    },
    {
      en: "One half of the world cannot understand the pleasures of the other.",
      zh: "世上一半的人，無法理解另一半人的樂趣。",
      author: "Jane Austen", authorZh: "珍·奧斯汀", source: "Emma (1815)", kind: "real"
    },
    {
      en: "One cannot think well, love well, sleep well, if one has not dined well.",
      zh: "沒有吃好，就不能好好思考、好好去愛、好好睡覺。",
      author: "Virginia Woolf", authorZh: "吳爾芙", source: "A Room of One's Own (1929)", kind: "real"
    },
    {
      en: "Those who contemplate the beauty of the earth find reserves of strength that will endure as long as life lasts.",
      zh: "凝視大地之美的人，會找到源源不絕的力量，伴隨一生。",
      author: "Rachel Carson", authorZh: "瑞秋·卡森", source: "The Sense of Wonder (1965)", kind: "real"
    },
    {
      en: "The mountains are calling & I must go.",
      zh: "山在呼喚，我必須出發。",
      author: "John Muir", authorZh: "約翰·繆爾", source: "Letter to his sister Sarah (1873)", kind: "real"
    },
    {
      en: "Carpe diem. Seize the day, boys. Make your lives extraordinary.",
      zh: "Carpe diem，把握今天，孩子們。讓你們的人生與眾不同。",
      author: "John Keating", authorZh: "基廷老師", source: "Dead Poets Society (1989), written by Tom Schulman", kind: "real"
    },
    {
      en: "Get busy living or get busy dying.",
      zh: "要麼忙著好好活，要麼忙著等死。",
      author: "Andy Dufresne", authorZh: "安迪", source: "The Shawshank Redemption (1994)", kind: "real"
    },
    {
      en: "Yesterday is history, tomorrow is a mystery, but today is a gift. That is why it is called the present.",
      zh: "昨天已成歷史，明天仍是謎，但今天是一份禮物，所以英文叫它 present（禮物，也解作「現在」）。",
      author: "Master Oogway", authorZh: "烏龜大師", source: "Kung Fu Panda (2008)", kind: "real"
    },
    {
      en: "“Just living is not enough,” said the butterfly, “one must have sunshine, freedom, and a little flower.”",
      zh: "「光是活著還不夠，」蝴蝶說，「還要有陽光、自由，和一朵小花。」",
      author: "Hans Christian Andersen", authorZh: "安徒生", source: "“The Butterfly” (1861, English translation)", kind: "real"
    },
    {
      en: "And I think to myself, what a wonderful world.",
      zh: "我心裡想：這世界多麼美好。",
      author: "Louis Armstrong", authorZh: "路易斯·岩士唐", source: "“What a Wonderful World” (1967), written by Bob Thiele & George David Weiss", kind: "real"
    },

    // ---------- Original lines written for this app ----------
    {
      en: "Today doesn't need to be perfect to be worth enjoying.",
      zh: "今天不必完美，也值得好好享受。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Take the long way home once in a while. The view is part of the trip.",
      zh: "間中行遠一點路回家吧。沿途風景，都是旅程的一部分。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Rest is part of the plan, not a break from it.",
      zh: "休息本來就是計劃的一部分，不是計劃以外的事。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Say yes to a small adventure: a new street, a new dish, a new friend.",
      zh: "對小小的冒險說「好」：一條新的街、一道新的菜、一個新朋友。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Before today ends, notice one beautiful thing.",
      zh: "今天完結之前，留意一件美好的事。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "The inbox will still be there tomorrow. This sunset won't.",
      zh: "電郵明天還在，這個日落不會。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Joy is not a reward for finishing everything. You're allowed to feel it now.",
      zh: "快樂不是做完所有事之後的獎勵，你現在就可以快樂。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Call the friend you keep meaning to call.",
      zh: "打個電話給那位你一直想聯絡的朋友吧。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Count what went right today, even the small things.",
      zh: "數一數今天順利的事，小事也算。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Slow down long enough to really taste your food.",
      zh: "慢下來，好好品嚐你面前的食物。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "A walk by the sea fixes more than you'd think.",
      zh: "去海邊散散步，比你想像中更治癒。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Plan the trip, then leave room for the detour.",
      zh: "行程可以計劃好，但記得留些空間給意外的轉彎。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "You're allowed to do nothing for a while.",
      zh: "你可以容許自己甚麼都不做，休息一陣子。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    },
    {
      en: "Laugh out loud at least once today.",
      zh: "今天至少要開懷大笑一次。",
      author: "Live & Enjoy", authorZh: "Live & Enjoy 原創", source: "Original", kind: "original"
    }
  ];

  if (typeof module === "object" && module.exports) {
    module.exports = QUOTES;
  } else {
    root.LIVE_ENJOY_QUOTES = QUOTES;
  }
})(typeof self !== "undefined" ? self : this);
