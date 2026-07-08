// Massive Encyclopedic ICAR Database for all 17 supported crops.
// Contains detailed information for Chatbot retrieval.

export const cropDetails = {
  wheat: {
    soil: "Well-drained fertile loamy and clayey loamy soils are best suited for wheat cultivation. The optimum soil pH is 6.0 to 7.0.",
    sowing: "Best sowing time is November to mid-December. Seed rate is typically 40-50 kg per acre. Spacing should be 22.5 cm between rows.",
    fertilizer: "General recommendation is 120 kg N, 60 kg P, and 40 kg K per hectare. Apply half N and full P & K as a basal dose. Remaining N should be top-dressed at first irrigation (CRI stage) and late tillering.",
    irrigation: "Requires 4-6 irrigations. Critical stages: Crown Root Initiation (21 days), Tillering (40-45 days), Late jointing (60-65 days), Flowering (80-85 days), Milking (100-105 days), and Dough stage (115-120 days).",
    diseases: "Major diseases include Rust (Brown, Yellow, Black), Karnal Bunt, and Loose Smut. Control: Seed treatment with Vitavax (2.5g/kg seed). For rust, spray Propiconazole (Tilt 25 EC) at 0.1%.",
    pests: "Aphids, Termites, and Armyworms. Control: For termites, treat seed with Chlorpyrifos 20 EC (4ml/kg). For aphids, spray Imidacloprid 17.8 SL at 100ml/ha.",
    harvest: "Harvest when grains become hard and moisture content reaches 20-22%. Straw should become dry and brittle."
  },
  rice: {
    soil: "Clay or clay loams with good water retention capacity. Can tolerate a wide pH range (4.5 to 8.0).",
    sowing: "Kharif sowing: June to July. Nursery requires 20-25 kg seeds per hectare. Transplanting is done at 20x15 cm spacing after 21-25 days of nursery.",
    fertilizer: "100-120 kg N, 50-60 kg P, and 40-50 kg K per hectare. Apply Zinc Sulphate (25 kg/ha) if soil is zinc deficient.",
    irrigation: "High water requirement. Maintain 2-5 cm standing water from rooting till grain filling. Drain field 15 days before harvest.",
    diseases: "Blast, Bacterial Leaf Blight (BLB), and Sheath Blight. Control: For Blast, spray Tricyclazole 75 WP (0.6g/L). For BLB, use Streptocycline (1g/10L).",
    pests: "Stem Borer, Brown Plant Hopper (BPH), Leaf Folder. Control: Cartap Hydrochloride 4G (18kg/ha) for borers. Pymetrozine 50 WG (300g/ha) for BPH.",
    harvest: "Harvest when 80% of panicles turn golden yellow and grain moisture is around 20%."
  },
  maize: {
    soil: "Deep, fertile, well-drained loamy soils rich in organic matter. Avoid waterlogged areas. Optimum pH 6.5 - 7.5.",
    sowing: "Kharif: June-July. Rabi: Oct-Nov. Seed rate: 20 kg/ha. Spacing: 60x20 cm.",
    fertilizer: "120 kg N, 60 kg P, 40 kg K per ha. High nutrient demand. Basal: 1/3 N + full P & K. Top dress remaining N at knee-high and tasseling stages.",
    irrigation: "Critical stages: Tasseling (50-55 days) and Silking (60-65 days). Highly sensitive to both drought and waterlogging.",
    diseases: "Turcicum Leaf Blight, Maydis Leaf Blight, Stalk Rots. Control: Mancozeb (2.5g/L) for blights. Ensure proper drainage to avoid stalk rot.",
    pests: "Fall Armyworm (FAW) and Stem Borer. Control: For FAW, spray Emamectin Benzoate 5 SG (0.4g/L) or Spinetoram 11.7 SC (0.5ml/L) directed into the whorl.",
    harvest: "Harvest when husk turns yellow and grains are hard with a black layer at the base (moisture 20-25%)."
  },
  cotton: {
    soil: "Deep black soils (Regur), clay loams, or well-drained sandy loams. pH 6.0 - 8.0.",
    sowing: "April-May (North) or June-July (Central/South). Seed rate: 2-3 kg/ha for Bt hybrids. Spacing: 90x60 cm or 120x60 cm.",
    fertilizer: "150:75:75 kg NPK/ha for irrigated Bt cotton. Apply N in 3-4 splits.",
    irrigation: "Critical stages: Square formation, Flowering, and Boll development. Avoid water stress during boll formation to prevent shedding.",
    diseases: "Bacterial Blight, Leaf Spots, Root Rot. Control: Copper Oxychloride (3g/L) + Streptocycline.",
    pests: "Bollworms (Pink, Spotted, American), Whitefly, Aphids, Jassids. Control: Use Bt varieties for bollworms. For sucking pests, use Flonicamid 50 WG or Diafenthiuron 50 WP.",
    harvest: "Hand-picking of fully opened bolls (Kapas). Usually requires 3-4 pickings."
  },
  sugarcane: {
    soil: "Well-drained deep loamy soils. Tolerant to a wide range but prefers pH 6.5 - 7.5.",
    sowing: "Spring (Feb-Mar) or Autumn (Oct). Seed rate: 35,000-40,000 three-budded setts/ha. Spacing: 90-120 cm row-to-row.",
    fertilizer: "Heavy feeder. 250:100:100 kg NPK/ha. Apply N in 3-4 splits before earthing up.",
    irrigation: "Needs frequent irrigation. Critical stages: Formative (60-130 days), Grand Growth (130-250 days).",
    diseases: "Red Rot, Smut, Wilt. Control: Red Rot is systemic; use healthy setts and treat with Carbendazim (0.1%) before planting. Crop rotation is essential.",
    pests: "Early Shoot Borer, Top Borer, Internode Borer, Termites. Control: Chlorantraniliprole 18.5 SC (375ml/ha) for borers.",
    harvest: "Harvest when canes are mature (brix reading >18). Stop irrigation 15 days before harvest."
  },
  mustard: {
    soil: "Sandy loam to clay loam. Thrives well in light soils. Moderately tolerant to salinity.",
    sowing: "Oct to mid-Nov. Seed rate: 4-5 kg/ha. Spacing: 30x10 cm.",
    fertilizer: "80:40:40 kg NPK/ha + 40 kg Sulphur/ha (improves oil content). Apply half N and full P, K, S at sowing.",
    irrigation: "2-3 irrigations. Critical stages: Rosette (25-30 days) and Siliqua formation (55-60 days).",
    diseases: "Alternaria Blight, White Rust, Powdery Mildew. Control: Mancozeb (2g/L) for blight and white rust.",
    pests: "Mustard Aphid, Painted Bug, Sawfly. Control: Dimethoate 30 EC or Imidacloprid 17.8 SL for aphids.",
    harvest: "Harvest when 75% of siliquae turn yellowish-brown to avoid shattering."
  },
  soybean: {
    soil: "Well-drained fertile loams and clay loams. Sensitive to salinity. pH 6.0 - 7.5.",
    sowing: "Mid-June to mid-July. Seed rate: 65-75 kg/ha. Treat seeds with Bradyrhizobium japonicum.",
    fertilizer: "20:60:40 kg NPK/ha + 20 kg S/ha as basal. Since it's a legume, N requirement is low.",
    irrigation: "Mostly rainfed. If dry spell occurs, irrigate at flowering and pod filling stages.",
    diseases: "Yellow Mosaic Virus (YMV), Rust, Charcoal Rot. Control: Use YMV resistant varieties. Control whitefly (vector) with Thiamethoxam.",
    pests: "Girdle Beetle, Stem Fly, Defoliators (Spodoptera). Control: Chlorantraniliprole 18.5 SC or Indoxacarb.",
    harvest: "Harvest when leaves drop entirely and pods turn brown/yellow."
  },
  groundnut: {
    soil: "Well-drained, light textured sandy loams (facilitates peg penetration and pod harvesting). Requires adequate calcium.",
    sowing: "Kharif (June-July). Seed rate: 100-120 kg kernels/ha. Spacing: 30x10 cm.",
    fertilizer: "20:50:40 kg NPK/ha. Apply Gypsum at 400 kg/ha at pegging stage to improve pod filling.",
    irrigation: "Critical stages: Flowering, Pegging, and Pod development. Avoid moisture stress during peg penetration.",
    diseases: "Tikka Disease (Leaf Spots), Rust, Collar Rot. Control: Chlorothalonil or Hexaconazole for leaf spots.",
    pests: "White Grub, Aphids, Thrips. Control: Seed treatment with Imidacloprid. Chlorpyrifos soil drenching for white grubs.",
    harvest: "Harvest when leaves turn yellow and inner shell becomes dark/veined."
  },
  potato: {
    soil: "Loose, friable, well-drained sandy loam or loam soils rich in organic matter. Avoid compact clay.",
    sowing: "Rabi (Oct-Nov). Seed rate: 25-30 quintals of tubers/ha. Spacing: 60x20 cm.",
    fertilizer: "150:80:100 kg NPK/ha. Heavy feeder. Full P, K and half N at planting, remaining N at earthing up.",
    irrigation: "Keep soil uniformly moist but avoid waterlogging. Critical stage: Tuber initiation (45-50 days). Stop irrigation 10 days before harvest.",
    diseases: "Late Blight, Early Blight, Common Scab. Control: Late Blight is devastating; spray Mancozeb or Metalaxyl prophylactically.",
    pests: "Aphids (vector for viruses), Potato Tuber Moth, White Grubs. Control: Phorate 10G in soil for grubs/aphids.",
    harvest: "Dehaulm (cut foliage) 10-15 days before harvest to harden the tuber skin."
  },
  chickpea: {
    soil: "Well-drained heavy soils (clay loams to black soils) for rainfed; light soils for irrigated. Rough seedbed preferred.",
    sowing: "Oct to mid-Nov. Seed rate: 75-100 kg/ha for Kabuli, 50-60 kg/ha for Desi. Treat with Rhizobium.",
    fertilizer: "20:40:20 kg NPK/ha as basal.",
    irrigation: "Requires very little water. If available, irrigate at branching and pod formation. Avoid irrigation at flowering.",
    diseases: "Fusarium Wilt, Ascochyta Blight, Dry Root Rot. Control: Deep summer ploughing, seed treatment with Trichoderma (4g/kg).",
    pests: "Gram Pod Borer (Helicoverpa armigera). Control: Install Pheromone traps. Spray Emamectin Benzoate or NPV.",
    harvest: "Harvest when leaves turn yellow and pods are dry."
  },
  bajra: {
    soil: "Highly adaptable. Does well in poor, sandy, and light soils. Highly drought tolerant.",
    sowing: "Kharif (July). Seed rate: 4-5 kg/ha. Spacing: 45x10-15 cm.",
    fertilizer: "60:30:30 kg NPK/ha. Apply half N and full P, K as basal.",
    irrigation: "Mostly rainfed. Needs moisture at tillering and flowering if prolonged dry spell occurs.",
    diseases: "Downy Mildew, Ergot, Smut. Control: Use resistant hybrids. Seed treatment with Metalaxyl (Apron 35 SD).",
    pests: "Shoot fly, Stem Borer, White Grub. Control: Phorate 10G in soil before sowing.",
    harvest: "Harvest when grain moisture is around 15-20% and grains are hard."
  },
  jowar: {
    soil: "Clay loam or heavy soils with good water holding capacity. Deep black soils are ideal.",
    sowing: "Kharif (June-July) or Rabi (Sept-Oct). Seed rate: 8-10 kg/ha.",
    fertilizer: "80:40:40 kg NPK/ha.",
    irrigation: "Drought resistant. Critical stages: Booting, Flowering, and Grain filling.",
    diseases: "Grain Mold, Downy Mildew, Rust. Control: Spray Mancozeb for molds.",
    pests: "Shoot Fly (major early pest), Stem Borer, Fall Armyworm. Control: Early sowing avoids shoot fly. Seed treatment with Imidacloprid.",
    harvest: "Harvest when grains become hard and moisture is below 20%."
  },
  tur: {
    soil: "Well-drained light to medium textured soils. Extremely sensitive to waterlogging.",
    sowing: "June-July. Seed rate: 12-15 kg/ha. Spacing: 60x20 cm or 90x20 cm.",
    fertilizer: "20:50:20 kg NPK/ha. Legume, so basal starter dose of N is enough.",
    irrigation: "Deep root system, highly drought tolerant. Irrigate at flowering and pod filling if dry.",
    diseases: "Fusarium Wilt, Sterility Mosaic Disease (SMD). Control: Use resistant varieties like Asha. Seed treatment with Trichoderma.",
    pests: "Pod Borer (Helicoverpa), Pod Fly. Control: Indoxacarb or Spinosad at flowering and pod setting.",
    harvest: "Harvest when 80% pods turn brown and leaves begin to drop."
  },
  moong: {
    soil: "Well-drained loam to sandy loam soils. Avoid alkaline and saline soils.",
    sowing: "Kharif (July), Zaid/Summer (March). Seed rate: 15-20 kg/ha (Kharif) or 25-30 kg/ha (Summer).",
    fertilizer: "20:40:20 kg NPK/ha as basal.",
    irrigation: "3-4 irrigations for summer crop. Critical stages: Pre-flowering and Pod formation.",
    diseases: "Yellow Mosaic Virus (YMV), Cercospora Leaf Spot. Control: Vector (Whitefly) control via Imidacloprid. YMV resistant varieties.",
    pests: "Whitefly, Thrips, Pod Borer. Control: Dimethoate or Thiamethoxam.",
    harvest: "Harvest in 2-3 pickings as pods mature, or cut whole plant when 80% pods mature to avoid shattering."
  },
  urad: {
    soil: "Heavier soils than moong. Black cotton soils and clay loams with good drainage.",
    sowing: "Kharif (July). Seed rate: 15-20 kg/ha.",
    fertilizer: "20:40:20 kg NPK/ha.",
    irrigation: "Mostly rainfed. Avoid water stress at flowering and grain filling.",
    diseases: "Yellow Mosaic Virus, Powdery Mildew, Leaf Crinkle. Control: Spray Dinocap or Carbendazim for powdery mildew.",
    pests: "Whitefly (vector for YMV), Stem Fly, Jassids.",
    harvest: "Harvest when pods turn black and brittle."
  },
  tea: {
    soil: "Well-drained, deep, friable acidic soils (pH 4.5 - 5.5). Cannot tolerate waterlogging.",
    sowing: "Vegetative propagation via cuttings. Planted in trenches or pits. Spacing varies (e.g., 105x60 cm).",
    fertilizer: "Requires N, P, K, Mg, and Zn. Example: 100-150 kg N/ha applied in multiple splits matching the flushing cycles.",
    irrigation: "Requires high rainfall (1500-3000 mm). Sprinkler irrigation during dry winter/summer months is critical for flushing.",
    diseases: "Blister Blight, Black Root Rot, Red Rust. Control: Copper fungicides (Hexaconazole or Copper Oxychloride) for Blister Blight.",
    pests: "Tea Mosquito Bug, Red Spider Mite, Thrips. Control: Integrated management; Spiromesifen or Propargite for mites. Quinalphos for bugs.",
    harvest: "Plucking of 'two leaves and a bud' every 7-14 days depending on the flush and weather."
  },
  coffee: {
    soil: "Deep, well-drained loamy soils rich in organic matter. Slopes are preferred to prevent water stagnation. pH 6.0-6.5.",
    sowing: "Seedlings or rooted cuttings planted at 2.5x2.5m (Arabica) or 3x3m (Robusta). Requires shade trees.",
    fertilizer: "Post-monsoon and pre-monsoon applications. Approx 120:90:120 kg NPK/ha applied in 3-4 splits.",
    irrigation: 'Crucial "Blossom showers" (25-40 mm) required in Feb-March for uniform flowering, followed by "Backing showers" 20 days later for fruit set. Sprinkler irrigation is used if rain fails.',
    diseases: "Coffee Leaf Rust, Black Rot. Control: Bordeaux mixture (1%) pre and post-monsoon. Use resistant Arabica varieties.",
    pests: "Coffee Berry Borer, White Stem Borer. Control: Stem scrubbing and swabbing with Chlorpyrifos for White Stem Borer. Phostoxin fumigation for Berry Borer.",
    harvest: "Selective picking of ripe red cherries (fly picking, main picking, and stripping). Processed via wet or dry methods."
  },
  mango: {
    soil: "Deep, well-drained loamy soils are ideal. Avoid alkaline, waterlogged, or highly rocky soils. pH 5.5 - 7.5.",
    sowing: "Plant grafts in pits of 1x1x1m at 10x10m spacing (normal) or 5x5m (high density) at the onset of monsoon.",
    fertilizer: "For a 10-year tree: 1kg N, 0.5kg P, 1kg K per tree annually. Apply in two splits (post-harvest and pre-flowering).",
    irrigation: "Young plants require frequent watering. Mature trees need irrigation mainly from fruit set to maturity at 10-15 day intervals.",
    diseases: "Powdery Mildew, Anthracnose, Mango Malformation. Control: Spray Hexaconazole for mildew, Copper Oxychloride for Anthracnose.",
    pests: "Mango Hopper, Mealy Bug, Fruit Fly. Control: Imidacloprid for hoppers, install fruit fly traps.",
    harvest: "Harvest physiologically mature fruits with an 8-10mm stalk to avoid sap burn."
  },
  banana: {
    soil: "Rich, well-drained, fertile loams with high organic matter. Sensitive to waterlogging. pH 6.5 - 7.5.",
    sowing: "Plant disease-free suckers or tissue culture plants at 1.8x1.8m. Planting is generally done in June-July.",
    fertilizer: "Heavy feeder. Apply 200g N, 50g P, 300g K per plant in 3-4 splits before shooting.",
    irrigation: "Needs copious water. Drip irrigation is highly recommended. Requires 70-75 irrigations per year.",
    diseases: "Panama Wilt (Fusarium), Sigatoka Leaf Spot, Bunchy Top Virus. Control: Use resistant TC plants. Eradicate virus-infected plants.",
    pests: "Rhizome Weevil, Pseudostem Borer, Aphids (virus vector). Control: Chlorpyrifos application for borers.",
    harvest: "Harvest when fruits become plump, angles become round, and color changes from dark green to light green."
  },
  tomato: {
    soil: "Well-drained sandy loam to clay loam. Sensitive to waterlogging. pH 6.0 - 7.0.",
    sowing: "Raise nursery. Transplant 25-30 day old seedlings at 60x45cm spacing on raised beds.",
    fertilizer: "120:60:60 kg NPK/ha. Basal: half N + full P & K. Top dress remaining N at 30 and 45 days after transplanting.",
    irrigation: "Maintain uniform moisture to prevent blossom end rot and fruit cracking.",
    diseases: "Early Blight, Late Blight, Leaf Curl Virus. Control: Mancozeb for blight. Control whiteflies for virus.",
    pests: "Fruit Borer (Helicoverpa), Whitefly. Control: Spinosad or Emamectin Benzoate for borers.",
    harvest: "Pick at breaker stage for distant markets, or full red for local markets and processing."
  },
  onion: {
    soil: "Friable, well-drained loams. Avoid heavy clays which restrict bulb expansion. pH 6.0 - 7.0.",
    sowing: "Transplant 6-8 week old seedlings at 15x10cm spacing on flat beds or broad bed furrows.",
    fertilizer: "100:50:50 kg NPK/ha + Sulphur (important for pungency). Apply half N and full P, K, S as basal.",
    irrigation: "Frequent light irrigations. Critical at bulb enlargement. Stop irrigation 15 days before harvest.",
    diseases: "Purple Blotch, Stemphylium Blight. Control: Spray Mancozeb + Tricyclazole.",
    pests: "Thrips (causes silvery white patches). Control: Fipronil or Spinetoram.",
    harvest: "Harvest when 50-75% tops fall over (neck fall). Cure in shade with tops for 3-5 days."
  },
  apple: {
    soil: "Deep, fertile, well-drained loams. Avoid hardpan. pH 5.8 - 6.5. Needs chilling hours depending on variety.",
    sowing: "Plant grafted plants on clonal rootstocks during winter dormancy in pits. Spacing depends on rootstock vigor.",
    fertilizer: "Apply NPK based on soil test and leaf analysis. Foliar calcium is important for fruit quality.",
    irrigation: "Provide drip irrigation during dry spells, especially during fruit development.",
    diseases: "Apple Scab, Powdery Mildew, Root Rot. Control: Follow strict fungicide spray schedule (Captan/Dodine for scab).",
    pests: "San Jose Scale, Woolly Aphid, Mites. Control: Dormant oil spray for scale. Propargite for mites.",
    harvest: "Harvest based on days from full bloom, ground color change, and firmness."
  },
  grapes: {
    soil: "Well-drained soils, tolerates gravelly soils well. Sensitive to high salinity.",
    sowing: "Plant rooted cuttings. Train vines on Bower (Mandap) or Y-trellis systems.",
    fertilizer: "Heavy feeder of Potash. Doses vary by region and pruning stage. Apply organic manures abundantly.",
    irrigation: "Drip irrigation is standard. Water stress applied before pruning; copious water during berry development.",
    diseases: "Downy Mildew, Powdery Mildew, Anthracnose. Control: Bordeaux mixture, Metalaxyl for downy mildew.",
    pests: "Mealy Bug, Thrips, Flea Beetle. Control: Buprofezin for mealy bugs.",
    harvest: "Grapes do not ripen off the vine. Harvest only when desired Brix (TSS) is achieved."
  },
  cabbage: {
    soil: "Cool season crop. Well-drained loams with high organic matter. Tolerates slightly acidic soils.",
    sowing: "Transplant 4-5 week old seedlings at 60x45cm on ridges.",
    fertilizer: "150:80:80 kg NPK/ha. Heavy N feeder. Split N into 3 doses.",
    irrigation: "Keep soil consistently moist. Fluctuating moisture causes head bursting.",
    diseases: "Black Rot, Damping off, Club Root. Control: Seed treatment with hot water or Streptocycline for black rot.",
    pests: "Diamondback Moth (DBM), Cabbage Butterfly. Control: Spinosad or Indoxacarb for DBM.",
    harvest: "Harvest when heads are firm and solid. Leaving too long causes bursting."
  },
  brinjal: {
    soil: "Well-drained, fertile loamy soils. Very adaptable. pH 6.0 - 7.0.",
    sowing: "Transplant 4-5 week old seedlings at 60x60cm spacing.",
    fertilizer: "100:50:50 kg NPK/ha. Apply half N, full P & K as basal. Remaining N in two splits.",
    irrigation: "Irrigate every 3-4 days in summer, 7-10 days in winter. Avoid waterlogging.",
    diseases: "Phomopsis Blight, Little Leaf (Mycoplasma). Control: Remove little leaf plants; control vector (leafhopper).",
    pests: "Shoot and Fruit Borer (major pest). Control: Clip infested shoots. Spray Chlorantraniliprole.",
    harvest: "Harvest fruits while tender, bright, and glossy. Dull color indicates over-maturity."
  },
  chilli: {
    soil: "Well-drained loamy soils. Highly sensitive to waterlogging. pH 6.0 - 7.0.",
    sowing: "Transplant 5-6 week old seedlings at 60x45cm on ridges.",
    fertilizer: "120:60:60 kg NPK/ha. Needs Potassium for fruit quality and color.",
    irrigation: "Avoid excess water (causes flower drop). Irrigate at 5-7 day intervals.",
    diseases: "Die-back / Anthracnose, Leaf Curl Virus. Control: Copper Oxychloride for die-back.",
    pests: "Thrips, Mites (cause upward/downward leaf curling respectively). Control: Diafenthiuron or Spiromesifen.",
    harvest: "Harvest green for vegetables, or fully ripe red for dry chilli spice."
  },
  turmeric: {
    soil: "Friable, well-drained sandy loams or clay loams. Loose soil is essential for rhizome development.",
    sowing: "Plant mother or primary finger rhizomes on raised beds at 30x15cm spacing. Mulching immediately is critical.",
    fertilizer: "120:60:120 kg NPK/ha. Heavy feeder of Potash.",
    irrigation: "Requires high moisture. Irrigate every 7-10 days depending on soil.",
    diseases: "Rhizome Rot, Leaf Spot. Control: Seed treatment with Mancozeb + Carbendazim. Drench soil if rot appears.",
    pests: "Shoot Borer, Rhizome Scale. Control: Dimethoate for shoot borer.",
    harvest: "Harvest when leaves turn yellow and dry up completely (7-9 months)."
  },
  black_pepper: {
    soil: "Well-drained, humus-rich forest soils. Extremely sensitive to water stagnation. pH 5.5 - 6.5.",
    sowing: "Planted as rooted cuttings trailing on live standards (like Erythrina) or dead wood.",
    fertilizer: "50g N, 50g P, 150g K per vine per year in two splits. Apply FYM or compost generously.",
    irrigation: "Mainly rainfed. Summer irrigation (drip) drastically increases yield and prevents spike shedding.",
    diseases: "Quick Wilt (Phytophthora foot rot), Slow Wilt. Control: Apply 1% Bordeaux mixture. Drench Trichoderma.",
    pests: "Pollu Beetle, Scale Insects. Control: Quinalphos for Pollu beetle.",
    harvest: "Harvest whole spikes when one or two berries turn bright orange-red."
  },
  cardamom: {
    soil: "Deep, well-drained, humus-rich forest loam soils under shade. pH 5.5 - 6.5.",
    sowing: "Propagated by seeds or suckers. Planted at 2x2m spacing in pits.",
    fertilizer: "75:75:150 kg NPK/ha in two splits. Keep mulch away from plant base.",
    irrigation: "Highly sensitive to moisture stress. Maintain 25-30mm irrigation per fortnight during summer.",
    diseases: "Katte Disease (Mosaic Virus), Capsule Rot. Control: Eradicate Katte affected plants. Copper fungicides for rot.",
    pests: "Cardamom Thrips (causes scabs on capsules), Shoot Borer. Control: Quinalphos or Spinosad for thrips.",
    harvest: "Harvest physiologically mature but green capsules every 20-25 days. Curing preserves green color."
  },
  coriander: {
    soil: "Well-drained loamy soils. Can be grown on black cotton soils with residual moisture.",
    sowing: "Split seeds into two halves by rubbing before sowing. Seed rate 15-20 kg/ha.",
    fertilizer: "60:30:30 kg NPK/ha. Apply half N and full P, K as basal.",
    irrigation: "3-4 irrigations depending on soil moisture. Avoid stress at flowering and seed setting.",
    diseases: "Powdery Mildew, Stem Gall. Control: Wettable sulphur for powdery mildew.",
    pests: "Aphids. Control: Imidacloprid spray at flowering stage.",
    harvest: "Harvest when grains turn yellowish brown. Over-ripening leads to shattering."
  },
  jute: {
    soil: "Alluvial soils are best. Deep, friable soils with high moisture holding capacity.",
    sowing: "Sown in fine seedbed before monsoon. Seed rate 5-7 kg/ha. Thinning at 3 weeks is essential.",
    fertilizer: "60:30:30 kg NPK/ha. N is critical for vegetative stalk growth.",
    irrigation: "Requires high moisture. Pre-monsoon irrigations may be needed for early sowing.",
    diseases: "Stem Rot, Root Rot. Control: Seed treatment with Carbendazim. Ensure drainage.",
    pests: "Jute Apion (Stem Weevil), Bihar Hairy Caterpillar. Control: Cypermethrin for caterpillars.",
    harvest: "Harvest at early pod formation stage (100-110 days) for best quality fibre. Bundles are then steeped in water for retting."
  },
  rubber: {
    soil: "Deep, lateritic or clay loam soils with good drainage. pH 4.5 - 6.0.",
    sowing: "Plant budded stumps in pits (e.g. 80x80x80 cm) at 4.5x4.5m spacing. Cover cropping (Pueraria) is standard.",
    fertilizer: "Depends on growth stage. NPKMg mixtures are applied based on leaf and soil analysis.",
    irrigation: "Mainly rainfed. Needs evenly distributed rainfall of 2000-3000mm.",
    diseases: "Abnormal Leaf Fall (Phytophthora), Pink Disease. Control: Prophylactic aerial spray of 1% Bordeaux mixture.",
    pests: "Scale insects, Mealy bugs. Control: Generally minor. Management of diseases is the main focus.",
    harvest: "Latex is harvested by controlled excision of bark (tapping) starting at 7 years of age."
  },
  tobacco: {
    soil: "Light, sandy loams with good drainage and low chlorides. Chlorides burn the leaf quality.",
    sowing: "Raise nursery. Transplant 6-8 week seedlings at 80x80 cm or 100x70 cm spacing.",
    fertilizer: "Varies by type (FCV vs Bidi). Nitrogen must be applied cautiously to avoid affecting leaf quality.",
    irrigation: "Sensitive to waterlogging. Moderate irrigation. Moisture stress at maturity aids ripening.",
    diseases: "Damping off (nursery), Black Shank, TMV. Control: Raised beds for nursery. Rogue TMV plants.",
    pests: "Tobacco Caterpillar (Spodoptera), Whitefly. Control: NPV or Chlorpyrifos for caterpillars.",
    harvest: "FCV tobacco is harvested leaf by leaf (priming) as they mature from bottom to top."
  },
  coconut: {
    soil: "Adaptable to many soils, best on deep sandy loams near coasts. Ensure minimum 1m depth.",
    sowing: "Plant robust seedlings in 1x1x1m pits at 7.5x7.5m spacing.",
    fertilizer: "500g N, 320g P, 1200g K per adult palm per year. Apply in two splits in circular basins.",
    irrigation: "Very responsive to summer irrigation. Drip irrigation prevents button shedding and increases yield.",
    diseases: "Root (Wilt) Disease, Bud Rot, Stem Bleeding. Control: Eradicate severely wilted palms. Bordeaux paste for bud rot.",
    pests: "Rhinoceros Beetle, Red Palm Weevil, Eriophyid Mite. Control: Neem cake in leaf axils. Pheromone traps.",
    harvest: "Harvest fully mature nuts (11-12 months) for copra. Tender coconuts at 7 months."
  },
  ragi: {
    soil: "Highly adaptable, grown on poor, shallow, and rocky soils. Tolerates slight acidity.",
    sowing: "Transplanting 3-week-old seedlings gives higher yield than broadcasting. Spacing 25x15 cm.",
    fertilizer: "60:30:30 kg NPK/ha. Responds well to organic manures.",
    irrigation: "Hardy crop. Can withstand dry spells but responds excellently to irrigation during tillering and flowering.",
    diseases: "Blast (Leaf, Neck, Finger). Control: Spray Tricyclazole or Mancozeb.",
    pests: "Stem borer, Earhead bug. Control: Usually minor, spray only if severe.",
    harvest: "Harvest earheads when they turn brown. May require two pickings if ripening is uneven."
  },
  barley: {
    soil: "Sandy loam to loam. More tolerant to soil salinity and alkalinity than wheat.",
    sowing: "Mid-Nov to Dec. Seed rate 75-100 kg/ha. Spacing 22.5 cm.",
    fertilizer: "60:30:20 kg NPK/ha for irrigated; half for rainfed. Nitrogen should not be excessive to prevent lodging.",
    irrigation: "Needs 2-3 irrigations. Critical stages: Active tillering and Booting. More drought tolerant than wheat.",
    diseases: "Covered and Loose Smut, Rusts. Control: Seed treatment with Vitavax. Rust resistant varieties.",
    pests: "Aphids. Control: Imidacloprid spray.",
    harvest: "Harvest when grain is hard and straw is dry and brittle."
  },
  lentil: {
    soil: "Well-drained loams. Cannot tolerate waterlogging or high soil salinity.",
    sowing: "Oct to Nov. Seed rate 30-40 kg/ha. Treat with Rhizobium.",
    fertilizer: "20:40:20 kg NPK/ha as basal dose.",
    irrigation: "Mostly grown on residual moisture. One irrigation at pod formation increases yield significantly.",
    diseases: "Wilt, Rust. Control: Seed treatment with Trichoderma. Avoid early sowing to escape wilt.",
    pests: "Aphids, Pod Borer. Control: Dimethoate for aphids.",
    harvest: "Harvest when plants turn yellow and pods are brown. Over-drying causes shattering."
  },
  peas: {
    soil: "Well-drained loamy soils. Very sensitive to waterlogging. pH 6.0 - 7.5.",
    sowing: "Oct-Nov for grain. Seed rate 75-100 kg/ha.",
    fertilizer: "20:60:40 kg NPK/ha. High phosphorus requirement.",
    irrigation: "1-2 irrigations. Pre-flowering and pod filling are critical. Avoid irrigation during full bloom.",
    diseases: "Powdery Mildew, Rust. Control: Spray Wettable Sulphur or Dinocap for powdery mildew.",
    pests: "Pod Borer, Leaf Miner, Aphids. Control: Spinosad for pod borer.",
    harvest: "Harvest when pods are fully filled and dry for grain, or green and tender for vegetable."
  },
  sunflower: {
    soil: "Deep, well-drained fertile soils. Highly responsive to good soil management.",
    sowing: "Can be grown year-round. Seed rate 5-6 kg/ha. Spacing 60x30 cm.",
    fertilizer: "80:40:40 kg NPK/ha. Needs Boron for good seed setting (spray Borax at capitulum stage).",
    irrigation: "Critical stages: Bud initiation, Flowering, and Seed development. Highly sensitive to waterlogging.",
    diseases: "Alternaria Blight, Head Rot. Control: Mancozeb for blight.",
    pests: "Head Borer (Helicoverpa), Bihar Hairy Caterpillar. Control: Bt or Spinosad for borers. Avoid spraying at bloom to save bees.",
    harvest: "Harvest when the back of the capitulum turns lemon yellow and bottom leaves dry up."
  },
  sesame: {
    soil: "Well-drained, light sandy loams. Extremely sensitive to waterlogging (even for a few hours).",
    sowing: "June-July. Seed rate 4-5 kg/ha. Mix seeds with dry sand to ensure uniform broadcasting.",
    fertilizer: "40:20:20 kg NPK/ha. Top dress half N at 30 days.",
    irrigation: "Usually rainfed. In dry spells, irrigate at flowering and capsule formation.",
    diseases: "Phyllody (Mycoplasma transmitted by leafhopper), Root Rot. Control: Eradicate phyllody plants; control vectors.",
    pests: "Leaf and Pod Caterpillar (Webber). Control: Quinalphos or Chlorpyrifos.",
    harvest: "Harvest when bottom leaves shed and capsules begin to turn yellow to avoid severe shattering."
  },
  castor: {
    soil: "Deep tap root system allows it to grow in deep, well-drained sandy or red soils. Highly drought tolerant.",
    sowing: "June-July. Seed rate 5-6 kg/ha. Spacing 90x60 cm or wider.",
    fertilizer: "80:40:40 kg NPK/ha for hybrids. Apply N in splits.",
    irrigation: "Rainfed crop. Supplemental irrigation during long dry spells during primary spike formation boosts yield.",
    diseases: "Seedling Blight, Botrytis Gray Mold (in heavy rains). Control: Carbendazim spray for mold.",
    pests: "Castor Semilooper, Capsule Borer. Control: Bacillus thuringiensis (Bt) spray or Quinalphos.",
    harvest: "Harvest spikes sequentially when capsules turn yellow/brown and start cracking."
  },
  linseed: {
    soil: "Clay loams or black cotton soils with high moisture retention. Grown mostly as rainfed (Utera).",
    sowing: "Oct-Nov. Seed rate 25-30 kg/ha. Spacing 25 cm.",
    fertilizer: "40:20:20 kg NPK/ha for rainfed. Double for irrigated.",
    irrigation: "Mostly rainfed. If irrigated, provide water at branching and flowering.",
    diseases: "Rust, Wilt, Powdery Mildew. Control: Use rust-resistant varieties.",
    pests: "Linseed Bud Fly (major pest). Control: Spray Imidacloprid or Dimethoate at bud emergence.",
    harvest: "Harvest when leaves are dry, capsules turn brown, and seeds rattle inside."
  }
};
