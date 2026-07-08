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
  }
};
