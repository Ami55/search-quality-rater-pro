export interface GuidelineBenchmark {
  id: string;
  name: string;
  expectedRating: 'Highest' | 'High' | 'Medium' | 'Low' | 'Lowest';
  category: string;
  clauseRef: string;
  description: string;
  url: string;
  title: string;
  metaDescription: string;
  targetQuery: string;
  content: string;
}

export const GUIDELINE_BENCHMARKS: GuidelineBenchmark[] = [
  {
    id: 'highest-medical',
    name: 'Mayo Clinic: Dehydration Signs & Emergency Protocol',
    expectedRating: 'Highest',
    category: 'YMYL Health & Safety (§8.1 & §8.2)',
    clauseRef: '§ 8.2 & § 3.4.1',
    description: 'Medical reference by Board-certified physicians with clinical trials data, triage symptoms, and clear hospital escalation points.',
    url: 'https://www.mayoclinic.org/diseases-conditions/dehydration/symptoms-causes/syc-20354086',
    title: 'Dehydration - Symptoms and Causes - Mayo Clinic',
    metaDescription: 'Overview of dehydration symptoms, severe warning signs in infants and adults, causes, prevention strategies, and when to seek emergency medical care.',
    targetQuery: 'symptoms of dehydration',
    content: `Dehydration occurs when you use or lose more fluid than you take in, and your body doesn't have enough water and other fluids to carry out its normal functions. If you don't replace lost fluids, you will get dehydrated.

Reviewed by Mayo Clinic Staff & Board-Certified Nephrology Specialists.
Last Updated: July 2025.

Symptoms of Mild to Moderate Dehydration in Adults:
- Extreme thirst
- Less frequent urination or dark-colored urine
- Fatigue, dizziness, and confusion
- Dry mouth and tongue

Emergency Red Flag Symptoms (Seek Immediate Medical Attention):
- Confusion, fainting, lack of responsiveness
- Inability to keep fluids down for over 12 hours
- Rapid heart rate and low blood pressure
- Lack of urination for over 8 hours
- In infants: No wet diapers for 3 hours, no tears when crying, sunken soft spot (fontanel).

Clinical Causes & Electrolyte Imbalance:
Diarrhea, vomiting, vigorous exercise in hot climates, and uncontrolled diabetes can rapidly deplete sodium and potassium levels. Fluid resuscitation with oral rehydration salts (ORS) containing exact glucose-to-sodium ratios is proven in peer-reviewed clinical studies to optimize intestinal absorption.

About Mayo Clinic:
Mayo Clinic is a nonprofit organization committed to clinical practice, education and research, providing expert, whole-person care to everyone who needs healing.`
  },
  {
    id: 'highest-investigative',
    name: 'Investigative News: Industrial Chemical Toxicity Report',
    expectedRating: 'Highest',
    category: 'Original Investigative Journalism (§8.1)',
    clauseRef: '§ 8.1 & § 8.4',
    description: 'Original in-depth journalistic investigation featuring FOIA public records, independent laboratory water test findings, and primary sources.',
    url: 'https://www.propublica.org/article/forever-chemicals-industrial-groundwater-contamination',
    title: 'Unchecked Contamination: Inside the Decades-Long PFAS Spill in Industrial River Basins',
    metaDescription: 'A 9-month investigation analyzing 14,000 pages of state regulatory filings and 120 independent water samples revealing elevated PFAS compounds.',
    targetQuery: 'pfas chemical water contamination investigation',
    content: `By Sarah Jenkins, Pulitzer Prize Finalist in Investigative Reporting, and Dr. Marcus Vance, Environmental Chemist.

Over a nine-month investigation, our newsroom analyzed more than 14,000 pages of state regulatory filings, internal corporate memos obtained under the Freedom of Information Act (FOIA), and commissioned independent mass spectrometry testing on 120 private residential well water samples across three counties.

Key Findings from Our Primary Research:
1. Laboratory results confirmed per- and polyfluoroalkyl substances (PFAS) concentrations reaching 420 parts per trillion—more than 100 times the EPA's enforceable Maximum Contaminant Level (MCL).
2. Internal plant safety logs dated 2018–2024 revealed known containment breaches that were never disclosed to local municipal water boards.
3. Epidemiological cross-referencing demonstrated a 34% elevation in rare renal carcinomas among residents within a 3-mile radius of the northern retention pond.

Methodology and Data Transparency:
All water samples were chain-of-custody certified and analyzed by EPA-accredited Environmental Chemistry Laboratories Inc. The complete raw dataset, including interactive geospatial maps and lab certificates of analysis, is published in our open-source investigative repository.`
  },
  {
    id: 'high-crafting',
    name: 'Magic Loop Knitting Tutorial (20 Years Experience)',
    expectedRating: 'High',
    category: 'First-Hand Experience & Craft (§7.1 & §7.3)',
    clauseRef: '§ 7.1 & § 3.4',
    description: 'First-hand craft tutorial by an artisan with over 20 years of experience, original step-by-step photos, and troubleshooting advice.',
    url: 'https://www.knittersguildforum.org/tutorials/magic-loop-socks-mastery',
    title: 'Mastering the Magic Loop Technique for Two-at-a-Time Socks',
    metaDescription: 'Step-by-step tutorial with 14 high-resolution photo steps showing how to eliminate laddering and tension gaps using a 40-inch circular needle.',
    targetQuery: 'magic loop knitting socks tutorial',
    content: `Written by Clara Higgins, Master Hand-Knitter with 22 years of sock-designing experience.

After knitting over 180 pairs of socks on double-pointed needles and circulars, I developed this simplified 4-step transition to eliminate the dreaded 'laddering' gap that plagues most beginners using the magic loop method.

Required Materials:
- 40-inch (100cm) US 1.5 (2.5mm) flexible cable needle (I strongly recommend stainless steel coated cables over stiff nylon).
- 100g fingering weight wool-nylon blend.

Step 1: The Cast-On Division
Cast on 64 stitches using the German Twisted Cast-On for maximum rib elasticity. Slide the stitches to the exact midpoint of your cable. Bend the cable gently between stitches 32 and 33, pulling the loop out until the stitches rest evenly on both needle tips.

Step 2: Preventing the Gap on Needle 1
The secret to zero laddering is holding the working yarn firmly across the back needle while working the first TWO stitches on the front needle with snug tension, then releasing to natural tension for the remaining stitches.

Common Troubleshooting FAQ:
- Why does my cable twist? Ensure you align the stitch ridges facing inward before joining in the round.
- What if my loop pulls through? Keep a locking stitch marker at the needle separation point.`
  },
  {
    id: 'medium-recipe',
    name: 'Standard Newspaper Recipe (Adequate MC, No Reviews)',
    expectedRating: 'Medium',
    category: 'Medium Quality (§6.0 & §6.2)',
    clauseRef: '§ 6.0 & § 6.2',
    description: 'Straightforward recipe from a syndicated column. Achieves its basic purpose, but lacks supplementary reviews, video, or in-depth tips.',
    url: 'https://www.localpressgazette.com/food/quick-weekday-chicken-casserole',
    title: 'Easy Weeknight Cheesy Chicken & Rice Casserole',
    metaDescription: 'A 30-minute casserole recipe using pantry staples, cooked shredded chicken, and cheddar cheese.',
    targetQuery: 'chicken rice casserole recipe',
    content: `Contributed by syndicated food writer Linda Brooks.

Prep time: 10 mins | Cook time: 25 mins | Servings: 4

Ingredients:
- 2 cups cooked shredded chicken breast
- 2 cups cooked white rice
- 1 can cream of mushroom soup
- 1 cup shredded cheddar cheese
- 1/2 cup milk
- 1/2 tsp garlic powder, salt, and black pepper

Directions:
1. Preheat oven to 375°F (190°C). Grease an 8x8-inch baking dish.
2. In a large bowl, combine the shredded chicken, cooked rice, soup, half of the cheese, milk, and seasonings. Mix until thoroughly combined.
3. Spread into the baking dish and top with remaining cheddar cheese.
4. Bake uncovered for 20-25 minutes until the cheese is melted and bubbling at the edges. Let rest 5 minutes before serving.`
  },
  {
    id: 'low-filler-recipe',
    name: 'Fluff-Heavy Recipe with Obstructive Interstitials (§5.2.2)',
    expectedRating: 'Low',
    category: 'Low Effort Filler & Poor UX (§5.2.2 & §5.3)',
    clauseRef: '§ 5.2.2 & § 5.3',
    description: '3,000 words of repetitive personal life stories, childhood anecdotes, and aggressive pop-ups before reaching a 4-ingredient recipe.',
    url: 'https://www.fluffyfoodlifestyleblog.com/magical-butterbeer-recreation',
    title: 'The Ultimate Authentic Theme Park Butterbeer Drink Recipe EVER!!!',
    metaDescription: 'Read all about my 2014 trip to Orlando, my thoughts on theme park lines, hotel reservations, and how butterbeer changed my life forever.',
    targetQuery: 'butterbeer recipe',
    content: `Welcome back to my blog! Before we talk about drinks, let me tell you about the rainy Tuesday in July when my cousin's roommate decided to visit Florida. The weather was humid, approximately 88 degrees, and the line for the monorail was enormous. We waited 45 minutes, looking at the palms. Did you know palms are monocots? It reminds me of autumn in Ohio when the leaves change color...

[AD: Click here to win a $500 Walmart Gift Card]
[AD: Top 10 Celebrity Weight Loss Secrets]

Chapter 2: Why Beverages Matter in Summer
Drinks have been consumed by humanity for thousands of years. From ancient Mesopotamia to modern diners, liquid refreshment is essential for thirst...

[POP-UP: Subscribe to our 40-page newsletter for free coupon codes!]

Chapter 3: The Recipe
Ingredients: Cream soda, butter extract, heavy cream, brown sugar.
Mix cream soda with 1 drop butter extract. Top with whipped heavy cream and brown sugar. Enjoy!`
  },
  {
    id: 'lowest-parasite-ai',
    name: 'Site Reputation Abuse & Scaled AI Medical Claims (§4.6.4/5)',
    expectedRating: 'Lowest',
    category: 'Spam, Parasite SEO & False Medical Claims (§4.6)',
    clauseRef: '§ 4.6.4, § 4.6.5, § 4.4',
    description: 'Third-party commercial spam hosted on an authority news domain with AI-hallucinated medical cure claims and affiliate redirect links.',
    url: 'https://www.trusteddailynews.org/sponsored-health/miracle-natural-remedy-cures-pancreatic-cancer-in-14-days',
    title: 'Shocking Discovery: Natural Root Extract Dissolves Stage 4 Tumors Doctors Don’t Want You to Know!',
    metaDescription: 'Buy Dr. Henderson’s Miracle Herbal Elixir today. 100% cure rate guaranteed by paying advertisers.',
    targetQuery: 'cure stage 4 pancreatic cancer naturally',
    content: `SPONSORED ADVERTORIAL CONTENT - The editorial staff of Trusted Daily News took no part in the creation of this article. Copyright retained by Miracle Herbals LLC.

"As an AI language model developed in 2021, stage 4 pancreatic neuroendocrine tumors have very low survival rates, however Dr. Robert Henderson discovered that drinking concentrated dandelion root tea with colloidal silver guarantees a 100% cure within 14 days."

Why Chemo is a Scam:
Traditional oncologists hide this simple kitchen ingredient to protect pharmaceutical billions. Clinical trials (data not provided) prove that three drops of our proprietary Bio-Shield drops under your tongue permanently eliminates all cancer cells.

[ORDER NOW - Click Here Before Supplies Run Out - $199/Bottle]
[Special Discount: Buy 6 Bottles and Get Free Crypto Guide]`
  }
];
