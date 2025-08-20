import React, { useState, useEffect, useCallback } from 'react';
import { 
  Bird, Camera, MapPin, Search, Filter, TrendingUp, TrendingDown, Star, Eye, Info, ChevronRight, 
  Leaf, AlertTriangle, Loader2, TreePine, Fish, Mountain, Waves, Users, Shield, Globe,
  Heart, Activity, BarChart3, PieChart as PieChartIcon, Map, Calendar, Award, Target,
  BookOpen, Lightbulb, Compass, Zap, Wind, Sun, Droplets, Factory
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Tooltip, Legend } from 'recharts';
import { fetchINaturalistConservationStatus, ConservationStatusData, speciesCategories } from './BiodiversityAnalytics';
import LeafletMap from './Map/LeafletMap';

// Enhanced interfaces for comprehensive biodiversity data
interface Ecosystem {
  id: number;
  name: string;
  type: string;
  location: string;
  area: string;
  keyFeatures: string[];
  biodiversityIndex: number;
  threats: string[];
  conservationStatus: string;
  image: string;
  species: number;
  endemics: number;
  description: string;
}

interface ConservationProject {
  id: number;
  name: string;
  organization: string;
  type: string;
  location: string;
  startDate: string;
  status: string;
  budget: string;
  impact: string;
  description: string;
  image: string;
}

interface CulturalHeritage {
  id: number;
  community: string;
  location: string;
  practices: string[];
  contribution: string;
  challenges: string[];
  image: string;
}

interface Threat {
  id: number;
  name: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  ecosystems: string[];
  impact: string;
  description: string;
  solutions: string[];
}

const BiodiversityTracker: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState('overview');
  const [selectedSubTab, setSelectedSubTab] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [selectedEcosystem, setSelectedEcosystem] = useState<number | null>(null);
  const [selectedSpecies, setSelectedSpecies] = useState<number | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [threatLevels, setThreatLevels] = useState<ConservationStatusData[]>([]);

  // Fetch conservation data
  useEffect(() => {
    fetchINaturalistConservationStatus().then(setThreatLevels);
  }, []);

  // Comprehensive Kenya species database
  const speciesDatabase = [
    {
      id: 1,
      name: 'Panthera leo',
      commonName: 'African Lion',
      category: 'Mammals',
      status: 'Vulnerable',
      habitat: 'Savannas, Grasslands, Open Woodlands',
      region: 'Maasai Mara, Tsavo, Amboseli',
      population: '~2,000 in Kenya',
      threats: ['Human-Wildlife Conflict', 'Habitat Loss', 'Prey Depletion'],
      image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      name: 'Loxodonta africana',
      commonName: 'African Elephant',
      category: 'Mammals',
      status: 'Endangered',
      habitat: 'Savannas, Forests, Wetlands',
      region: 'Amboseli, Tsavo, Maasai Mara',
      population: '~36,000 in Kenya',
      threats: ['Poaching', 'Habitat Fragmentation', 'Human Encroachment'],
      image: 'https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      name: 'Diceros bicornis',
      commonName: 'Black Rhinoceros',
      category: 'Mammals',
      status: 'Critically Endangered',
      habitat: 'Savannas, Grasslands, Desert',
      region: 'Ol Pejeta, Tsavo, Lake Nakuru',
      population: '~840 in Kenya',
      threats: ['Poaching for Horn', 'Habitat Loss', 'Limited Range'],
      image: 'https://images.pexels.com/photos/3551236/pexels-photo-3551236.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      name: 'Giraffa reticulata',
      commonName: 'Reticulated Giraffe',
      category: 'Mammals',
      status: 'Endangered',
      habitat: 'Savannas, Open Woodlands',
      region: 'Samburu, Meru, Laikipia',
      population: '~15,000 globally, ~8,500 in Kenya',
      threats: ['Habitat Loss', 'Poaching', 'Civil Unrest'],
      image: 'https://images.pexels.com/photos/802112/pexels-photo-802112.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 5,
      name: 'Acinonyx jubatus',
      commonName: 'Cheetah',
      category: 'Mammals',
      status: 'Vulnerable',
      habitat: 'Grasslands, Savannas',
      region: 'Maasai Mara, Amboseli, Tsavo',
      population: '~1,160 in Kenya',
      threats: ['Habitat Loss', 'Human-Wildlife Conflict', 'Prey Competition'],
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 6,
      name: 'Phoenicopterus roseus',
      commonName: 'Greater Flamingo',
      category: 'Birds',
      status: 'Least Concern',
      habitat: 'Alkaline Lakes, Wetlands',
      region: 'Lake Nakuru, Lake Bogoria, Lake Naivasha',
      population: 'Millions visit Kenya seasonally',
      threats: ['Water Level Changes', 'Pollution', 'Disturbance'],
      image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 7,
      name: 'Equus quagga',
      commonName: 'Plains Zebra',
      category: 'Mammals',
      status: 'Near Threatened',
      habitat: 'Grasslands, Savannas',
      region: 'Maasai Mara, Amboseli, Tsavo',
      population: '~200,000 in Kenya',
      threats: ['Habitat Loss', 'Competition with Livestock', 'Hunting'],
      image: 'https://images.pexels.com/photos/750479/pexels-photo-750479.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 8,
      name: 'Connochaetes taurinus',
      commonName: 'Blue Wildebeest',
      category: 'Mammals',
      status: 'Least Concern',
      habitat: 'Grasslands, Savannas',
      region: 'Maasai Mara, Amboseli, Laikipia',
      population: '~1.3 million in Mara ecosystem',
      threats: ['Habitat Fragmentation', 'Disease', 'Climate Change'],
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 9,
      name: 'Panthera pardus',
      commonName: 'African Leopard',
      category: 'Mammals',
      status: 'Near Threatened',
      habitat: 'Forests, Savannas, Mountains',
      region: 'Aberdares, Mt. Kenya, Maasai Mara',
      population: '~9,000-15,000 in Kenya',
      threats: ['Habitat Loss', 'Human-Wildlife Conflict', 'Prey Depletion'],
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 10,
      name: 'Hippopotamus amphibius',
      commonName: 'Common Hippopotamus',
      category: 'Mammals',
      status: 'Vulnerable',
      habitat: 'Rivers, Lakes, Wetlands',
      region: 'Mara River, Lake Naivasha, Tana River',
      population: '~4,000 in Kenya',
      threats: ['Habitat Loss', 'Water Pollution', 'Human Encroachment'],
      image: 'https://images.pexels.com/photos/4577793/pexels-photo-4577793.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 11,
      name: 'Bucorvus leadbeateri',
      commonName: 'Southern Ground-Hornbill',
      category: 'Birds',
      status: 'Vulnerable',
      habitat: 'Savannas, Grasslands',
      region: 'Maasai Mara, Tsavo, Amboseli',
      population: '~1,500 in Kenya',
      threats: ['Habitat Loss', 'Nest Site Competition', 'Persecution'],
      image: 'https://images.pexels.com/photos/1564471/pexels-photo-1564471.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 12,
      name: 'Chelonia mydas',
      commonName: 'Green Sea Turtle',
      category: 'Reptiles',
      status: 'Endangered',
      habitat: 'Coastal Waters, Coral Reefs',
      region: 'Watamu, Malindi, Lamu',
      population: 'Nesting sites on Kenyan coast',
      threats: ['Plastic Pollution', 'Coastal Development', 'Fishing Nets'],
      image: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 13,
      name: 'Struthio camelus',
      commonName: 'Common Ostrich',
      category: 'Birds',
      status: 'Least Concern',
      habitat: 'Savannas, Semi-deserts',
      region: 'Tsavo, Amboseli, Northern Kenya',
      population: '~150,000 in Kenya',
      threats: ['Habitat Loss', 'Egg Collection', 'Hunting'],
      image: 'https://images.pexels.com/photos/1564471/pexels-photo-1564471.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 14,
      name: 'Syncerus caffer',
      commonName: 'African Buffalo',
      category: 'Mammals',
      status: 'Least Concern',
      habitat: 'Savannas, Forests, Wetlands',
      region: 'Maasai Mara, Tsavo, Amboseli',
      population: '~75,000 in Kenya',
      threats: ['Disease', 'Habitat Loss', 'Human-Wildlife Conflict'],
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 15,
      name: 'Tragelaphus strepsiceros',
      commonName: 'Greater Kudu',
      category: 'Mammals',
      status: 'Least Concern',
      habitat: 'Woodlands, Thickets',
      region: 'Tsavo, Northern Kenya',
      population: '~25,000 in Kenya',
      threats: ['Hunting', 'Habitat Degradation'],
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 16,
      name: 'Beatragus hunteri',
      commonName: 'Hirola Antelope',
      category: 'Mammals',
      status: 'Critically Endangered',
      habitat: 'Grasslands, Semi-arid areas',
      region: 'Garissa, Tana River County',
      population: '~500 individuals',
      threats: ['Habitat Loss', 'Drought', 'Predation', 'Disease'],
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 17,
      name: 'Procolobus rufomitratus',
      commonName: 'Tana River Red Colobus',
      category: 'Mammals',
      status: 'Critically Endangered',
      habitat: 'Riverine Forests',
      region: 'Tana River County',
      population: '~1,200 individuals',
      threats: ['Deforestation', 'Agriculture', 'Human Settlement'],
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 18,
      name: 'Otus ireneae',
      commonName: 'Sokoke Scops Owl',
      category: 'Birds',
      status: 'Endangered',
      habitat: 'Coastal Forests',
      region: 'Arabuko-Sokoke Forest',
      population: '~1,500 individuals',
      threats: ['Deforestation', 'Habitat Fragmentation'],
      image: 'https://images.pexels.com/photos/1564471/pexels-photo-1564471.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 19,
      name: 'Dugong dugon',
      commonName: 'Dugong',
      category: 'Marine Mammals',
      status: 'Vulnerable',
      habitat: 'Seagrass Beds, Shallow Coastal Waters',
      region: 'Kenyan Coast, Lamu',
      population: '~200 individuals',
      threats: ['Boat Strikes', 'Fishing Nets', 'Habitat Degradation'],
      image: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 20,
      name: 'Tursiops truncatus',
      commonName: 'Bottlenose Dolphin',
      category: 'Marine Mammals',
      status: 'Least Concern',
      habitat: 'Coastal Waters, Open Ocean',
      region: 'Kenyan Coast',
      population: 'Several hundred individuals',
      threats: ['Fishing Nets', 'Pollution', 'Boat Traffic'],
      image: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 21,
      name: 'Balearica regulorum',
      commonName: 'Grey Crowned Crane',
      category: 'Birds',
      status: 'Endangered',
      habitat: 'Wetlands, Grasslands',
      region: 'Lake Victoria Basin, Central Kenya',
      population: '~15,000 in Kenya',
      threats: ['Habitat Loss', 'Illegal Trade', 'Agriculture'],
      image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 22,
      name: 'Crocodylus niloticus',
      commonName: 'Nile Crocodile',
      category: 'Reptiles',
      status: 'Least Concern',
      habitat: 'Rivers, Lakes, Wetlands',
      region: 'Mara River, Tana River, Lake Turkana',
      population: '~7,000 in Kenya',
      threats: ['Habitat Loss', 'Human-Wildlife Conflict', 'Pollution'],
      image: 'https://images.pexels.com/photos/4577793/pexels-photo-4577793.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 23,
      name: 'Python sebae',
      commonName: 'African Rock Python',
      category: 'Reptiles',
      status: 'Least Concern',
      habitat: 'Savannas, Forests, Wetlands',
      region: 'Nationwide',
      population: 'Widespread but declining',
      threats: ['Habitat Loss', 'Human Persecution', 'Trade'],
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 24,
      name: 'Leptopelis uluguruensis',
      commonName: 'Kenyan Reed Frog',
      category: 'Amphibians',
      status: 'Near Threatened',
      habitat: 'Montane Forests, Wetlands',
      region: 'Central and Western Kenya',
      population: 'Unknown, declining',
      threats: ['Deforestation', 'Climate Change', 'Pollution'],
      image: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  const recentSightings = [
    {
      id: 1,
      species: 'Panthera leo',
      commonName: 'African Lion',
      location: 'Maasai Mara National Reserve',
      date: '2024-08-15',
      confidence: 95,
      status: 'Vulnerable',
      image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      species: 'Loxodonta africana',
      commonName: 'African Elephant',
      location: 'Amboseli National Park',
      date: '2024-08-14',
      confidence: 98,
      status: 'Endangered',
      image: 'https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      species: 'Phoenicopterus roseus',
      commonName: 'Greater Flamingo',
      location: 'Lake Nakuru National Park',
      date: '2024-08-13',
      confidence: 92,
      status: 'Least Concern',
      image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 4,
      species: 'Diceros bicornis',
      commonName: 'Black Rhinoceros',
      location: 'Ol Pejeta Conservancy',
      date: '2024-08-12',
      confidence: 97,
      status: 'Critically Endangered',
      image: 'https://images.pexels.com/photos/3551236/pexels-photo-3551236.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 5,
      species: 'Beatragus hunteri',
      commonName: 'Hirola Antelope',
      location: 'Ishaqbini Hirola Reserve',
      date: '2024-08-11',
      confidence: 89,
      status: 'Critically Endangered',
      image: 'https://images.pexels.com/photos/792381/pexels-photo-792381.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  // Comprehensive Kenya ecosystems data
  const ecosystems: Ecosystem[] = [
    {
      id: 1,
      name: 'Maasai Mara National Reserve',
      type: 'Savannah & Grasslands',
      location: 'Narok County',
      area: '1,510 km²',
      keyFeatures: ['Great Migration', 'Big Five', 'Acacia Woodlands'],
      biodiversityIndex: 95,
      threats: ['Overgrazing', 'Tourism Pressure', 'Human Encroachment'],
      conservationStatus: 'Protected',
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800',
      species: 570,
      endemics: 12,
      description: 'World-famous for the annual wildebeest migration and exceptional wildlife diversity.'
    },
    {
      id: 2,
      name: 'Kakamega Rainforest',
      type: 'Tropical Rainforest',
      location: 'Kakamega County',
      area: '238 km²',
      keyFeatures: ['Last Tropical Rainforest in Kenya', 'Endemic Species', 'Medicinal Plants'],
      biodiversityIndex: 88,
      threats: ['Deforestation', 'Encroachment', 'Logging'],
      conservationStatus: 'National Reserve',
      image: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=800',
      species: 400,
      endemics: 27,
      description: 'Kenya\'s only tropical rainforest, harboring unique flora and fauna.'
    },
    {
      id: 3,
      name: 'Mount Kenya National Park',
      type: 'Mountain & Alpine',
      location: 'Central Kenya',
      area: '715 km²',
      keyFeatures: ['Alpine Vegetation', 'Endemic Plants', 'Glacial Lakes'],
      biodiversityIndex: 82,
      threats: ['Climate Change', 'Tourism Impact', 'Invasive Species'],
      conservationStatus: 'UNESCO World Heritage',
      image: 'https://images.pexels.com/photos/3608263/pexels-photo-3608263.jpeg?auto=compress&cs=tinysrgb&w=800',
      species: 882,
      endemics: 81,
      description: 'Africa\'s second-highest peak with unique alpine biodiversity.'
    },
    {
      id: 4,
      name: 'Watamu Marine National Park',
      type: 'Marine & Coastal',
      location: 'Kilifi County',
      area: '213 km²',
      keyFeatures: ['Coral Reefs', 'Sea Turtles', 'Mangroves'],
      biodiversityIndex: 90,
      threats: ['Coral Bleaching', 'Overfishing', 'Pollution'],
      conservationStatus: 'Marine Protected Area',
      image: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=800',
      species: 600,
      endemics: 15,
      description: 'Prime marine ecosystem with pristine coral reefs and diverse marine life.'
    },
    {
      id: 5,
      name: 'Lake Nakuru National Park',
      type: 'Wetlands & Lakes',
      location: 'Nakuru County',
      area: '188 km²',
      keyFeatures: ['Flamingo Spectacle', 'Rhino Sanctuary', 'Alkaline Lake'],
      biodiversityIndex: 85,
      threats: ['Water Level Changes', 'Pollution', 'Invasive Species'],
      conservationStatus: 'National Park',
      image: 'https://images.pexels.com/photos/1619317/pexels-photo-1619317.jpeg?auto=compress&cs=tinysrgb&w=800',
      species: 450,
      endemics: 8,
      description: 'Famous for millions of flamingos and successful rhino conservation.'
    },
    {
      id: 6,
      name: 'Chalbi Desert',
      type: 'Desert & Drylands',
      location: 'Marsabit County',
      area: '100,000 km²',
      keyFeatures: ['Desert Adaptations', 'Nomadic Wildlife', 'Salt Flats'],
      biodiversityIndex: 45,
      threats: ['Desertification', 'Overgrazing', 'Climate Change'],
      conservationStatus: 'Unprotected',
      image: 'https://images.pexels.com/photos/3551236/pexels-photo-3551236.jpeg?auto=compress&cs=tinysrgb&w=800',
      species: 120,
      endemics: 5,
      description: 'Kenya\'s largest desert showcasing unique arid ecosystem adaptations.'
    }
  ];

  // Conservation projects data
  const conservationProjects: ConservationProject[] = [
    {
      id: 1,
      name: 'Kenya Forest Restoration Program',
      organization: 'Kenya Forest Service',
      type: 'Reforestation',
      location: 'Nationwide',
      startDate: '2022',
      status: 'Active',
      budget: '$500M',
      impact: '15 billion trees by 2032',
      description: 'Ambitious national program to restore forest cover to 30% by 2032.',
      image: 'https://images.pexels.com/photos/1423600/pexels-photo-1423600.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      name: 'Northern Rangelands Trust',
      organization: 'Community Conservancies',
      type: 'Community Conservation',
      location: 'Northern Kenya',
      startDate: '2004',
      status: 'Ongoing',
      budget: '$50M annually',
      impact: '44,000 km² conserved',
      description: 'Community-led conservation covering 8% of Kenya\'s land mass.',
      image: 'https://images.pexels.com/photos/247502/pexels-photo-247502.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      name: 'Marine Conservation Project',
      organization: 'Kenya Wildlife Service',
      type: 'Marine Protection',
      location: 'Coastal Kenya',
      startDate: '2020',
      status: 'Active',
      budget: '$25M',
      impact: '1,200 km² protected',
      description: 'Protecting coral reefs and marine biodiversity along Kenya\'s coast.',
      image: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  // Cultural heritage data
  const culturalHeritage: CulturalHeritage[] = [
    {
      id: 1,
      community: 'Maasai',
      location: 'Southern Kenya',
      practices: ['Rotational Grazing', 'Sacred Forests', 'Traditional Medicine'],
      contribution: 'Wildlife coexistence and grassland management',
      challenges: ['Land Rights', 'Modernization', 'Climate Change'],
      image: 'https://images.pexels.com/photos/631317/pexels-photo-631317.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 2,
      community: 'Mijikenda',
      location: 'Coastal Kenya',
      practices: ['Kaya Forests Protection', 'Traditional Fishing', 'Mangrove Conservation'],
      contribution: 'Sacred forest conservation and marine stewardship',
      challenges: ['Tourism Pressure', 'Development', 'Youth Migration'],
      image: 'https://images.pexels.com/photos/847393/pexels-photo-847393.jpeg?auto=compress&cs=tinysrgb&w=800'
    },
    {
      id: 3,
      community: 'Samburu',
      location: 'Northern Kenya',
      practices: ['Wildlife Protection', 'Drought Management', 'Pastoralism'],
      contribution: 'Elephant corridors and rangeland conservation',
      challenges: ['Conflicts', 'Drought', 'Market Access'],
      image: 'https://images.pexels.com/photos/66898/elephant-cub-tsavo-kenya-66898.jpeg?auto=compress&cs=tinysrgb&w=800'
    }
  ];

  // Threats data
  const threats: Threat[] = [
    {
      id: 1,
      name: 'Deforestation',
      severity: 'Critical',
      ecosystems: ['Forests', 'Mountains'],
      impact: 'Habitat loss, climate change, soil erosion',
      description: 'Rapid loss of forest cover due to agriculture and logging.',
      solutions: ['Reforestation', 'Community Forests', 'Alternative Livelihoods']
    },
    {
      id: 2,
      name: 'Climate Change',
      severity: 'High',
      ecosystems: ['All Ecosystems'],
      impact: 'Species migration, habitat shifts, extreme weather',
      description: 'Rising temperatures and changing precipitation patterns.',
      solutions: ['Carbon Sequestration', 'Adaptation Strategies', 'Renewable Energy']
    },
    {
      id: 3,
      name: 'Human-Wildlife Conflict',
      severity: 'High',
      ecosystems: ['Savannahs', 'Agricultural Areas'],
      impact: 'Crop damage, livestock predation, human casualties',
      description: 'Increasing conflicts as human settlements expand.',
      solutions: ['Wildlife Corridors', 'Compensation Schemes', 'Community Education']
    },
    {
      id: 4,
      name: 'Poaching',
      severity: 'High',
      ecosystems: ['All Protected Areas'],
      impact: 'Species decline, ecosystem disruption',
      description: 'Illegal hunting for ivory, rhino horn, and bushmeat.',
      solutions: ['Anti-Poaching Units', 'Community Involvement', 'Demand Reduction']
    }
  ];

  // Analytics data
  const biodiversityTrends = [
    { year: '2015', forestCover: 6.99, wildlifePopulation: 85, marineHealth: 70 },
    { year: '2017', forestCover: 7.2, wildlifePopulation: 82, marineHealth: 68 },
    { year: '2019', forestCover: 7.5, wildlifePopulation: 88, marineHealth: 72 },
    { year: '2021', forestCover: 8.8, wildlifePopulation: 90, marineHealth: 75 },
    { year: '2023', forestCover: 12.1, wildlifePopulation: 92, marineHealth: 78 }
  ];

  const ecosystemHealth = [
    { name: 'Forests', health: 75, color: '#10b981' },
    { name: 'Savannahs', health: 85, color: '#f59e0b' },
    { name: 'Wetlands', health: 70, color: '#3b82f6' },
    { name: 'Marine', health: 65, color: '#06b6d4' },
    { name: 'Mountains', health: 80, color: '#8b5cf6' },
    { name: 'Deserts', health: 60, color: '#ef4444' }
  ];

  const speciesData = [
    { category: 'Birds', count: 1134, trend: 5.2, color: '#3b82f6', endangered: 89, vulnerable: 156, nearThreatened: 203 },
    { category: 'Mammals', count: 359, trend: 2.1, color: '#10b981', endangered: 43, vulnerable: 78, nearThreatened: 95 },
    { category: 'Reptiles', count: 191, trend: -1.5, color: '#f59e0b', endangered: 12, vulnerable: 28, nearThreatened: 34 },
    { category: 'Amphibians', count: 88, trend: -3.2, color: '#ef4444', endangered: 8, vulnerable: 15, nearThreatened: 22 },
    { category: 'Fish', count: 2750, trend: 4.8, color: '#8b5cf6', endangered: 45, vulnerable: 89, nearThreatened: 134 },
    { category: 'Plants', count: 6506, trend: 7.3, color: '#06b6d4', endangered: 234, vulnerable: 456, nearThreatened: 678 }
  ];

  // Realistic conservation status distribution
  const conservationStatusData = [
    { name: 'Least Concern', value: 7892, color: '#10b981', percentage: 71.5 },
    { name: 'Near Threatened', value: 1166, color: '#f59e0b', percentage: 10.6 },
    { name: 'Vulnerable', value: 822, color: '#ff6b35', percentage: 7.4 },
    { name: 'Endangered', value: 431, color: '#ef4444', percentage: 3.9 },
    { name: 'Critically Endangered', value: 187, color: '#991b1b', percentage: 1.7 },
    { name: 'Data Deficient', value: 530, color: '#6b7280', percentage: 4.8 }
  ];

  // Ecosystem biodiversity breakdown
  const ecosystemBiodiversity = [
    { ecosystem: 'Savannah & Grasslands', species: 3245, endemic: 89, threatened: 234, color: '#f59e0b' },
    { ecosystem: 'Forests', species: 2890, endemic: 156, threatened: 189, color: '#10b981' },
    { ecosystem: 'Marine & Coastal', species: 2156, endemic: 67, threatened: 145, color: '#06b6d4' },
    { ecosystem: 'Wetlands & Lakes', species: 1876, endemic: 45, threatened: 123, color: '#3b82f6' },
    { ecosystem: 'Mountains & Alpine', species: 967, endemic: 78, threatened: 89, color: '#8b5cf6' },
    { ecosystem: 'Desert & Drylands', species: 394, endemic: 23, threatened: 56, color: '#ef4444' }
  ];

  // Filter species based on search and category
  const filteredSpecies = speciesDatabase.filter(species => {
    const matchesSearch = species.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         species.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || species.category === filterType;
    return matchesSearch && matchesFilter;
  });

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-emerald-400 bg-emerald-500/20';
      case 'Medium': return 'text-yellow-400 bg-yellow-500/20';
      case 'High': return 'text-orange-400 bg-orange-500/20';
      case 'Critical': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Least Concern': return 'text-emerald-400 bg-emerald-500/20';
      case 'Near Threatened': return 'text-yellow-400 bg-yellow-500/20';
      case 'Vulnerable': return 'text-orange-400 bg-orange-500/20';
      case 'Endangered': return 'text-red-400 bg-red-500/20';
      case 'Critically Endangered': return 'text-red-600 bg-red-600/20';
      case 'Protected': return 'text-emerald-400 bg-emerald-500/20';
      case 'Unprotected': return 'text-red-400 bg-red-500/20';
      default: return 'text-slate-400 bg-slate-500/20';
    }
  };

  const renderTabContent = () => {
    switch (selectedTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Key Metrics Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <TreePine className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">Forest Cover</p>
                    <p className="text-2xl font-bold text-white">12.1%</p>
                    <p className="text-emerald-300 text-xs">Target: 30% by 2032</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Bird className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Total Species</p>
                    <p className="text-2xl font-bold text-white">11,028</p>
                    <p className="text-blue-300 text-xs">Documented species</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Shield className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-purple-400 text-sm font-medium">Protected Areas</p>
                    <p className="text-2xl font-bold text-white">60</p>
                    <p className="text-purple-300 text-xs">National parks & reserves</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Waves className="h-8 w-8 text-cyan-400" />
                  <div>
                    <p className="text-cyan-400 text-sm font-medium">Marine Reserves</p>
                    <p className="text-2xl font-bold text-white">6</p>
                    <p className="text-cyan-300 text-xs">Protected marine areas</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Biodiversity Trends Chart */}
            <div className="bg-slate-800/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-xl font-semibold text-white mb-6">Biodiversity Trends (2015-2023)</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={biodiversityTrends}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                    <XAxis dataKey="year" stroke="#64748b" />
                    <YAxis stroke="#64748b" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: '#1e293b', 
                        border: '1px solid #475569',
                        borderRadius: '8px'
                      }} 
                    />
                    <Legend />
                    <Line type="monotone" dataKey="forestCover" stroke="#10b981" name="Forest Cover %" strokeWidth={3} />
                    <Line type="monotone" dataKey="wildlifePopulation" stroke="#3b82f6" name="Wildlife Population Index" strokeWidth={3} />
                    <Line type="monotone" dataKey="marineHealth" stroke="#06b6d4" name="Marine Health Index" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Quick Access Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <button
                onClick={() => setSelectedTab('ecosystems')}
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all text-left group"
              >
                <Globe className="h-8 w-8 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-semibold text-white mb-2">Explore Ecosystems</h4>
                <p className="text-slate-400 text-sm">Discover Kenya's diverse habitats from savannahs to coral reefs</p>
              </button>

              <button
                onClick={() => setSelectedTab('conservation')}
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-blue-500/30 transition-all text-left group"
              >
                <Heart className="h-8 w-8 text-blue-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-semibold text-white mb-2">Conservation Projects</h4>
                <p className="text-slate-400 text-sm">Learn about ongoing efforts to protect biodiversity</p>
              </button>

              <button
                onClick={() => setSelectedTab('threats')}
                className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-red-500/30 transition-all text-left group"
              >
                <AlertTriangle className="h-8 w-8 text-red-400 mb-3 group-hover:scale-110 transition-transform" />
                <h4 className="text-lg font-semibold text-white mb-2">Threats & Challenges</h4>
                <p className="text-slate-400 text-sm">Understand the challenges facing Kenya's biodiversity</p>
              </button>
            </div>
          </div>
        );

      case 'ecosystems':
        return (
          <div className="space-y-6">
            {/* Ecosystem Type Filter */}
            <div className="flex flex-wrap gap-3">
              {['All', 'Savannah & Grasslands', 'Tropical Rainforest', 'Mountain & Alpine', 'Marine & Coastal', 'Wetlands & Lakes', 'Desert & Drylands'].map((type) => (
                <button
                  key={type}
                  onClick={() => setFilterType(type === 'All' ? 'all' : type)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filterType === (type === 'All' ? 'all' : type)
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-slate-800/30 text-slate-400 border border-slate-700/50 hover:text-white'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Ecosystems Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {ecosystems
                .filter(eco => filterType === 'all' || eco.type === filterType)
                .map((ecosystem) => (
                  <div key={ecosystem.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden hover:border-emerald-500/30 transition-all">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={ecosystem.image}
                        alt={ecosystem.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{ecosystem.name}</h3>
                          <p className="text-slate-400 text-sm">{ecosystem.type}</p>
                          <p className="text-slate-500 text-xs">{ecosystem.location} • {ecosystem.area}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(ecosystem.conservationStatus)}`}>
                          {ecosystem.conservationStatus}
                        </span>
                      </div>

                      <p className="text-slate-400 text-sm">{ecosystem.description}</p>

                      {/* Biodiversity Metrics */}
                      <div className="grid grid-cols-3 gap-4 py-3 border-y border-slate-700/50">
                        <div className="text-center">
                          <p className="text-xl font-bold text-emerald-400">{ecosystem.biodiversityIndex}</p>
                          <p className="text-xs text-slate-500">Biodiversity Index</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-blue-400">{ecosystem.species}</p>
                          <p className="text-xs text-slate-500">Species</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xl font-bold text-purple-400">{ecosystem.endemics}</p>
                          <p className="text-xs text-slate-500">Endemics</p>
                        </div>
                      </div>

                      {/* Key Features */}
                      <div>
                        <h5 className="text-white text-sm font-medium mb-2">Key Features</h5>
                        <div className="flex flex-wrap gap-2">
                          {ecosystem.keyFeatures.map((feature, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-700/50 rounded text-xs text-slate-300">
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Threats */}
                      {ecosystem.threats.length > 0 && (
                        <div>
                          <h5 className="text-white text-sm font-medium mb-2">Primary Threats</h5>
                          <div className="flex flex-wrap gap-2">
                            {ecosystem.threats.map((threat, index) => (
                              <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                                {threat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      <button
                        onClick={() => setSelectedEcosystem(selectedEcosystem === ecosystem.id ? null : ecosystem.id)}
                        className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                      >
                        <Info className="h-4 w-4" />
                        {selectedEcosystem === ecosystem.id ? 'Hide Details' : 'Learn More'}
                        <ChevronRight className={`h-4 w-4 transition-transform ${selectedEcosystem === ecosystem.id ? 'rotate-90' : ''}`} />
                      </button>

                      {/* Expanded Details */}
                      {selectedEcosystem === ecosystem.id && (
                        <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-4">
                          <div className="bg-slate-900/30 rounded-lg p-4">
                            <h6 className="text-white text-sm font-medium mb-2">Conservation Initiatives</h6>
                            <ul className="text-xs text-slate-400 space-y-1">
                              <li>• Community-based conservation programs</li>
                              <li>• Wildlife monitoring and research</li>
                              <li>• Habitat restoration projects</li>
                              <li>• Eco-tourism development</li>
                            </ul>
                          </div>
                          
                          <div className="bg-slate-900/30 rounded-lg p-4">
                            <h6 className="text-white text-sm font-medium mb-2">How You Can Help</h6>
                            <ul className="text-xs text-slate-400 space-y-1">
                              <li>• Support conservation organizations</li>
                              <li>• Choose responsible eco-tourism</li>
                              <li>• Participate in citizen science</li>
                              <li>• Advocate for policy changes</li>
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
        );

      case 'conservation':
        return (
          <div className="space-y-6">
            {/* Conservation Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-gradient-to-br from-emerald-500/20 to-emerald-600/10 border border-emerald-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Target className="h-8 w-8 text-emerald-400" />
                  <div>
                    <p className="text-emerald-400 text-sm font-medium">Active Projects</p>
                    <p className="text-2xl font-bold text-white">127</p>
                    <p className="text-emerald-300 text-xs">Across Kenya</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Users className="h-8 w-8 text-blue-400" />
                  <div>
                    <p className="text-blue-400 text-sm font-medium">Communities Involved</p>
                    <p className="text-2xl font-bold text-white">342</p>
                    <p className="text-blue-300 text-xs">Local communities</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <TreePine className="h-8 w-8 text-purple-400" />
                  <div>
                    <p className="text-purple-400 text-sm font-medium">Trees Planted</p>
                    <p className="text-2xl font-bold text-white">2.1B</p>
                    <p className="text-purple-300 text-xs">Since 2020</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Featured Conservation Projects */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Featured Conservation Projects</h3>
              
              {conservationProjects.map((project) => (
                <div key={project.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 hover:border-emerald-500/30 transition-all">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-1">
                      <img
                        src={project.image}
                        alt={project.name}
                        className="w-full h-48 object-cover rounded-xl"
                      />
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-lg font-semibold text-white">{project.name}</h4>
                          <p className="text-slate-400 text-sm">{project.organization}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="bg-slate-700/50 px-2 py-1 rounded text-xs text-slate-300">{project.type}</span>
                            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded text-xs">{project.status}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-slate-400 text-sm">Budget</p>
                          <p className="text-lg font-bold text-white">{project.budget}</p>
                        </div>
                      </div>

                      <p className="text-slate-400">{project.description}</p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-3 border-y border-slate-700/50">
                        <div>
                          <p className="text-slate-500 text-xs">Location</p>
                          <p className="text-white text-sm">{project.location}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Started</p>
                          <p className="text-white text-sm">{project.startDate}</p>
                        </div>
                        <div>
                          <p className="text-slate-500 text-xs">Impact</p>
                          <p className="text-emerald-400 text-sm font-medium">{project.impact}</p>
                        </div>
                      </div>

                      <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors">
                          <Heart className="h-4 w-4" />
                          Support Project
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 rounded-lg hover:bg-slate-700 transition-colors">
                          <BookOpen className="h-4 w-4" />
                          Learn More
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Cultural Heritage & Traditional Knowledge */}
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-white">Indigenous Communities & Traditional Knowledge</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {culturalHeritage.map((heritage) => (
                  <div key={heritage.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={heritage.image}
                        alt={heritage.community}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-white">{heritage.community} Community</h4>
                        <p className="text-slate-400 text-sm">{heritage.location}</p>
                      </div>

                      <div>
                        <h5 className="text-white text-sm font-medium mb-2">Traditional Practices</h5>
                        <div className="space-y-1">
                          {heritage.practices.map((practice, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <Lightbulb className="h-3 w-3 text-yellow-400" />
                              <span className="text-slate-400 text-xs">{practice}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h5 className="text-white text-sm font-medium mb-2">Conservation Contribution</h5>
                        <p className="text-slate-400 text-xs">{heritage.contribution}</p>
                      </div>

                      <div>
                        <h5 className="text-white text-sm font-medium mb-2">Current Challenges</h5>
                        <div className="flex flex-wrap gap-1">
                          {heritage.challenges.map((challenge, index) => (
                            <span key={index} className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded text-xs">
                              {challenge}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'threats':
        return (
          <div className="space-y-6">
            {/* Threat Severity Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Critical', 'High', 'Medium', 'Low'].map((severity) => {
                const count = threats.filter(t => t.severity === severity).length;
                return (
                  <div key={severity} className={`rounded-2xl p-4 border ${getSeverityColor(severity).replace('text-', 'border-').replace(' bg-', '/30 bg-')}`}>
                    <div className="text-center">
                      <p className="text-2xl font-bold">{count}</p>
                      <p className="text-sm">{severity} Threats</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Detailed Threats */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-white">Major Threats to Kenya's Biodiversity</h3>
              
              {threats.map((threat) => (
                <div key={threat.id} className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-white">{threat.name}</h4>
                      <p className="text-slate-400 text-sm mt-1">{threat.description}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm font-medium ${getSeverityColor(threat.severity)}`}>
                      {threat.severity}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div>
                      <h5 className="text-white text-sm font-medium mb-2">Affected Ecosystems</h5>
                      <div className="space-y-1">
                        {threat.ecosystems.map((ecosystem, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Globe className="h-3 w-3 text-blue-400" />
                            <span className="text-slate-400 text-xs">{ecosystem}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h5 className="text-white text-sm font-medium mb-2">Impact</h5>
                      <p className="text-slate-400 text-xs">{threat.impact}</p>
                    </div>

                    <div>
                      <h5 className="text-white text-sm font-medium mb-2">Potential Solutions</h5>
                      <div className="space-y-1">
                        {threat.solutions.map((solution, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Zap className="h-3 w-3 text-emerald-400" />
                            <span className="text-slate-400 text-xs">{solution}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Climate Change Deep Dive */}
            <div className="bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/30 rounded-2xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Sun className="h-6 w-6 text-orange-400" />
                Climate Change Impact on Kenya's Biodiversity
              </h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="bg-slate-900/30 rounded-lg p-4">
                    <h5 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <Droplets className="h-4 w-4 text-blue-400" />
                      Water Resources
                    </h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Declining rainfall affecting Lake Nakuru's water levels</li>
                      <li>• Drought stress on wildlife in Tsavo ecosystem</li>
                      <li>• Wetland degradation threatening migratory birds</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/30 rounded-lg p-4">
                    <h5 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <Wind className="h-4 w-4 text-cyan-400" />
                      Temperature Changes
                    </h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Alpine vegetation shifting upward on Mt. Kenya</li>
                      <li>• Coral bleaching events along the coast</li>
                      <li>• Species migration pattern changes</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="bg-slate-900/30 rounded-lg p-4">
                    <h5 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <TreePine className="h-4 w-4 text-emerald-400" />
                      Adaptation Strategies
                    </h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Assisted migration for vulnerable species</li>
                      <li>• Corridor creation for wildlife movement</li>
                      <li>• Climate-resilient reforestation programs</li>
                    </ul>
                  </div>

                  <div className="bg-slate-900/30 rounded-lg p-4">
                    <h5 className="text-white text-sm font-medium mb-2 flex items-center gap-2">
                      <Factory className="h-4 w-4 text-purple-400" />
                      Mitigation Efforts
                    </h5>
                    <ul className="text-xs text-slate-400 space-y-1">
                      <li>• Carbon sequestration through reforestation</li>
                      <li>• Renewable energy in protected areas</li>
                      <li>• Sustainable agriculture practices</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="space-y-6">
            {/* Interactive Analytics Header */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Biodiversity Analytics Dashboard</h3>
                <p className="text-slate-400">Interactive analysis of Kenya's species and conservation data</p>
              </div>
              <div className="flex gap-3">
                <button className="px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
                  Export Data
                </button>
                <button className="px-4 py-2 bg-blue-500/20 text-blue-400 rounded-lg border border-blue-500/30">
                  Generate Report
                </button>
              </div>
            </div>

            {/* Analytics Sub-navigation */}
            <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl">
              <div className="flex flex-wrap border-b border-slate-700/50">
                {['overview', 'species', 'conservation', 'ecosystems'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setSelectedSubTab(tab)}
                    className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors capitalize ${
                      selectedSubTab === tab || (selectedSubTab === '' && tab === 'overview')
                        ? 'border-emerald-500 text-emerald-400'
                        : 'border-transparent text-slate-400 hover:text-white'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {(selectedSubTab === 'overview' || selectedSubTab === '') && (
                  <div className="space-y-6">
                    {/* Key Performance Indicators */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="bg-slate-900/50 rounded-xl p-4 border border-emerald-500/30">
                        <div className="flex items-center gap-3">
                          <Award className="h-6 w-6 text-emerald-400" />
                          <div>
                            <p className="text-emerald-400 text-sm font-medium">Total Species</p>
                            <p className="text-2xl font-bold text-white">11,028</p>
                            <p className="text-emerald-300 text-xs">+342 documented this year</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded-xl p-4 border border-red-500/30">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="h-6 w-6 text-red-400" />
                          <div>
                            <p className="text-red-400 text-sm font-medium">Threatened Species</p>
                            <p className="text-2xl font-bold text-white">1,440</p>
                            <p className="text-red-300 text-xs">13.1% of total species</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded-xl p-4 border border-purple-500/30">
                        <div className="flex items-center gap-3">
                          <Star className="h-6 w-6 text-purple-400" />
                          <div>
                            <p className="text-purple-400 text-sm font-medium">Endemic Species</p>
                            <p className="text-2xl font-bold text-white">458</p>
                            <p className="text-purple-300 text-xs">4.2% endemism rate</p>
                          </div>
                        </div>
                      </div>

                      <div className="bg-slate-900/50 rounded-xl p-4 border border-blue-500/30">
                        <div className="flex items-center gap-3">
                          <Activity className="h-6 w-6 text-blue-400" />
                          <div>
                            <p className="text-blue-400 text-sm font-medium">Research Projects</p>
                            <p className="text-2xl font-bold text-white">89</p>
                            <p className="text-blue-300 text-xs">Active studies</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Ecosystem Health and Species Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/50">
                        <h4 className="text-lg font-semibold text-white mb-6">Ecosystem Health Index</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={ecosystemHealth} layout="horizontal">
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                              <XAxis type="number" domain={[0, 100]} stroke="#64748b" />
                              <YAxis type="category" dataKey="name" stroke="#64748b" />
                              <Tooltip 
                                contentStyle={{ 
                                  backgroundColor: '#1e293b', 
                                  border: '1px solid #475569',
                                  borderRadius: '8px'
                                }} 
                              />
                              <Bar dataKey="health" radius={[0, 4, 4, 0]}>
                                {ecosystemHealth.map((entry, index) => (
                                  <Cell key={`ecosystem-cell-${index}`} fill={entry.color} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/50">
                        <h4 className="text-lg font-semibold text-white mb-6">Species by Category</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={speciesData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="count"
                                label={({ name, count }) => `${name}: ${count}`}
                              >
                                {speciesData.map((entry, index) => (
                                  <Cell key={`species-cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {selectedSubTab === 'species' && (
                  <div className="space-y-6">
                    {/* Species Search and Filter */}
                    <div className="flex flex-col lg:flex-row gap-4">
                      <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                        <input
                          type="text"
                          placeholder="Search species by name..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        />
                      </div>
                      <div className="flex gap-2">
                        {['all', 'Mammals', 'Birds', 'Reptiles', 'Amphibians', 'Marine Mammals'].map((category) => (
                          <button
                            key={category}
                            onClick={() => setFilterType(category)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                              filterType === category
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-slate-800/30 text-slate-400 hover:text-white'
                            }`}
                          >
                            {category}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Species Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredSpecies.map((species) => (
                        <div key={species.id} className="bg-slate-800/30 border border-slate-700/50 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all">
                          <div className="aspect-video overflow-hidden">
                            <img
                              src={species.image}
                              alt={species.commonName}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                            />
                          </div>
                          <div className="p-4 space-y-3">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="text-lg font-semibold text-white">{species.commonName}</h4>
                                <p className="text-slate-400 text-sm italic">{species.name}</p>
                                <p className="text-slate-500 text-xs">{species.category}</p>
                              </div>
                              <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getStatusColor(species.status)}`}>
                                {species.status}
                              </span>
                            </div>

                            <div className="space-y-2">
                              <div>
                                <p className="text-slate-400 text-xs font-medium">Habitat</p>
                                <p className="text-white text-sm">{species.habitat}</p>
                              </div>
                              <div>
                                <p className="text-slate-400 text-xs font-medium">Region</p>
                                <p className="text-white text-sm">{species.region}</p>
                              </div>
                              <div>
                                <p className="text-slate-400 text-xs font-medium">Population</p>
                                <p className="text-white text-sm">{species.population}</p>
                              </div>
                            </div>

                            {species.threats.length > 0 && (
                              <div>
                                <p className="text-slate-400 text-xs font-medium mb-1">Primary Threats</p>
                                <div className="flex flex-wrap gap-1">
                                  {species.threats.slice(0, 2).map((threat, index) => (
                                    <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                                      {threat}
                                    </span>
                                  ))}
                                  {species.threats.length > 2 && (
                                    <span className="px-2 py-1 bg-slate-700/50 text-slate-400 rounded text-xs">
                                      +{species.threats.length - 2} more
                                    </span>
                                  )}
                                </div>
                              </div>
                            )}

                            <button
                              onClick={() => setSelectedSpecies(selectedSpecies === species.id ? null : species.id)}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-colors"
                            >
                              <Info className="h-4 w-4" />
                              {selectedSpecies === species.id ? 'Hide Details' : 'Learn More'}
                            </button>

                            {selectedSpecies === species.id && (
                              <div className="mt-4 pt-4 border-t border-slate-700/50 space-y-3">
                                <div>
                                  <h6 className="text-white text-sm font-medium mb-2">Conservation Status Details</h6>
                                  <p className="text-slate-400 text-xs">
                                    {species.status === 'Critically Endangered' && 'Faces extremely high risk of extinction in the wild.'}
                                    {species.status === 'Endangered' && 'Faces very high risk of extinction in the wild.'}
                                    {species.status === 'Vulnerable' && 'Faces high risk of extinction in the wild.'}
                                    {species.status === 'Near Threatened' && 'Close to qualifying for threatened status.'}
                                    {species.status === 'Least Concern' && 'Does not qualify for threatened status.'}
                                  </p>
                                </div>
                                
                                <div>
                                  <h6 className="text-white text-sm font-medium mb-2">All Threats</h6>
                                  <div className="flex flex-wrap gap-1">
                                    {species.threats.map((threat, index) => (
                                      <span key={index} className="px-2 py-1 bg-red-500/20 text-red-400 rounded text-xs">
                                        {threat}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Species Categories Summary */}
                    <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/50">
                      <h4 className="text-lg font-semibold text-white mb-6">Species Categories Breakdown</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {speciesData.map((category, index) => (
                          <div key={index} className="bg-slate-800/30 rounded-xl p-4 border border-slate-700/30">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></div>
                              <h5 className="text-white font-medium">{category.category}</h5>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Total Species</span>
                                <span className="text-white font-medium">{category.count.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Endangered</span>
                                <span className="text-red-400 font-medium">{category.endangered}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Vulnerable</span>
                                <span className="text-orange-400 font-medium">{category.vulnerable}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-400 text-sm">Near Threatened</span>
                                <span className="text-yellow-400 font-medium">{category.nearThreatened}</span>
                              </div>
                              <div className="flex justify-between items-center pt-2 border-t border-slate-700/50">
                                <span className="text-slate-400 text-sm">Population Trend</span>
                                <span className={`font-medium flex items-center gap-1 ${category.trend > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                                  {category.trend > 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                  {Math.abs(category.trend)}%
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedSubTab === 'conservation' && (
                  <div className="space-y-6">
                    {/* Conservation Status Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/50">
                        <h4 className="text-lg font-semibold text-white mb-6">Conservation Status Distribution</h4>
                        <div className="h-80">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={conservationStatusData}
                                cx="50%"
                                cy="50%"
                                outerRadius={100}
                                dataKey="value"
                                label={({ name, percentage }) => `${name}: ${percentage}%`}
                              >
                                {conservationStatusData.map((entry, index) => (
                                  <Cell key={`conservation-cell-${index}`} fill={entry.color} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/50">
                        <h4 className="text-lg font-semibold text-white mb-6">Conservation Priorities</h4>
                        <div className="space-y-4">
                          {conservationStatusData
                            .filter(status => ['Critically Endangered', 'Endangered', 'Vulnerable'].includes(status.name))
                            .map((status, index) => (
                              <div key={index} className="flex items-center justify-between p-4 bg-slate-800/30 rounded-lg">
                                <div className="flex items-center gap-3">
                                  <div className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }}></div>
                                  <div>
                                    <p className="text-white font-medium">{status.name}</p>
                                    <p className="text-slate-400 text-sm">{status.percentage}% of all species</p>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <p className="text-xl font-bold text-white">{status.value}</p>
                                  <p className="text-slate-400 text-sm">species</p>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>

                    {/* Recent Sightings */}
                    <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/50">
                      <h4 className="text-lg font-semibold text-white mb-6">Recent Wildlife Sightings</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentSightings.map((sighting) => (
                          <div key={sighting.id} className="bg-slate-800/30 border border-slate-700/50 rounded-lg overflow-hidden">
                            <div className="aspect-video overflow-hidden">
                              <img
                                src={sighting.image}
                                alt={sighting.commonName}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="p-4 space-y-2">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h5 className="text-white font-medium">{sighting.commonName}</h5>
                                  <p className="text-slate-400 text-sm italic">{sighting.species}</p>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(sighting.status)}`}>
                                  {sighting.status}
                                </span>
                              </div>
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-3 w-3 text-blue-400" />
                                  <span className="text-slate-300 text-sm">{sighting.location}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Calendar className="h-3 w-3 text-emerald-400" />
                                  <span className="text-slate-300 text-sm">{sighting.date}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                  <span className="text-slate-400 text-sm">Confidence</span>
                                  <span className="text-emerald-400 font-medium">{sighting.confidence}%</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedSubTab === 'ecosystems' && (
                  <div className="space-y-6">
                    {/* Ecosystem Biodiversity Breakdown */}
                    <div className="bg-slate-900/30 rounded-2xl p-6 border border-slate-700/50">
                      <h4 className="text-lg font-semibold text-white mb-6">Biodiversity by Ecosystem</h4>
                      <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={ecosystemBiodiversity}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                            <XAxis dataKey="ecosystem" stroke="#64748b" angle={-45} textAnchor="end" height={100} />
                            <YAxis stroke="#64748b" />
                            <Tooltip 
                              contentStyle={{ 
                                backgroundColor: '#1e293b', 
                                border: '1px solid #475569',
                                borderRadius: '8px'
                              }} 
                            />
                            <Legend />
                            <Bar dataKey="species" name="Total Species" fill="#3b82f6" />
                            <Bar dataKey="endemic" name="Endemic Species" fill="#10b981" />
                            <Bar dataKey="threatened" name="Threatened Species" fill="#ef4444" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Ecosystem Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {ecosystemBiodiversity.map((ecosystem, index) => (
                        <div key={index} className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-6">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-4 h-4 rounded-full" style={{ backgroundColor: ecosystem.color }}></div>
                            <h5 className="text-white font-semibold">{ecosystem.ecosystem}</h5>
                          </div>
                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Total Species</span>
                              <span className="text-white font-bold text-lg">{ecosystem.species.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Endemic Species</span>
                              <span className="text-emerald-400 font-medium">{ecosystem.endemic}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">Threatened Species</span>
                              <span className="text-red-400 font-medium">{ecosystem.threatened}</span>
                            </div>
                            <div className="pt-3 border-t border-slate-700/50">
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">Threat Level</span>
                                <span className={`font-medium ${ecosystem.threatened > 200 ? 'text-red-400' : ecosystem.threatened > 100 ? 'text-orange-400' : 'text-emerald-400'}`}>
                                  {ecosystem.threatened > 200 ? 'High' : ecosystem.threatened > 100 ? 'Medium' : 'Low'}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Enhanced Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Kenya Biodiversity Monitor</h1>
          <p className="text-slate-400 mt-1">Comprehensive tracking of Kenya's rich biodiversity heritage</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
            onClick={() => setShowMapModal(true)}
          >
            <MapPin className="h-4 w-4" />
            Interactive Map
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30 hover:bg-emerald-500/30 transition-colors">
            <Calendar className="h-4 w-4" />
            Latest Report
          </button>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800/50 rounded-2xl">
        <div className="border-b border-slate-800/50">
          <nav className="flex flex-wrap">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'ecosystems', label: 'Ecosystems', icon: Globe },
              { id: 'conservation', label: 'Conservation', icon: Heart },
              { id: 'threats', label: 'Threats', icon: AlertTriangle },
              { id: 'analytics', label: 'Analytics', icon: PieChartIcon }
            ].map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                    selectedTab === tab.id
                      ? 'border-emerald-500 text-emerald-400'
                      : 'border-transparent text-slate-400 hover:text-white'
                  }`}
                >
                  <IconComponent className="h-4 w-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Interactive Map Modal */}
      {showMapModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-slate-900 rounded-2xl shadow-xl p-4 w-full max-w-6xl relative max-h-[90vh] overflow-auto">
            <button
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-2xl z-10"
              onClick={() => setShowMapModal(false)}
              aria-label="Close Map"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold text-white mb-4">Kenya Biodiversity Map</h2>
            <div className="h-96 w-full">
              <LeafletMap
                center={[0.0236, 37.9062]} // Kenya coordinates
                zoom={6}
                projectLocations={[]}
              />
            </div>
            <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
              {ecosystems.slice(0, 4).map((eco) => (
                <div key={eco.id} className="bg-slate-800/50 rounded-lg p-3">
                  <h4 className="text-white text-sm font-medium">{eco.name}</h4>
                  <p className="text-slate-400 text-xs">{eco.type}</p>
                  <p className="text-emerald-400 text-xs">{eco.species} species</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BiodiversityTracker;