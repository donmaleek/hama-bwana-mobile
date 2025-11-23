// app/(tabs)/featured.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Platform,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// World-class premium properties data
const premiumRentals = [
  {
    id: 1,
    name: "Skyline Penthouse with Infinity Pool",
    price: "450,000",
    location: "Upper Hill, Nairobi",
    image: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
    images: [
      "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
      "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg"
    ],
    bedrooms: 4,
    bathrooms: 4,
    size: "3200 sq ft",
    rating: 4.9,
    reviews: 89,
    amenities: ["Infinity Pool", "Smart Home", "Private Gym", "Concierge", "Wine Cellar", "Home Theater"],
    category: "ultra-luxury",
    features: ["Panoramic City Views", "Private Elevator", "Smart Lighting", "Heated Floors"],
    owner: {
      name: "Elite Living Group",
      rating: 4.9,
      verified: true,
      premium: true,
      responseTime: "5 min"
    },
    virtualTour: true,
    instantBooking: true,
    distance: "0.5 km",
    availableFrom: "2024-03-01",
    sustainability: ["Solar Powered", "Water Recycling", "EV Charging"],
    security: ["Biometric Access", "24/7 Security", "CCTV"]
  },
  {
    id: 2,
    name: "Beachfront Luxury Villa",
    price: "680,000",
    location: "Diani Beach, Mombasa",
    image: "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
    images: [
      "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg",
      "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg"
    ],
    bedrooms: 5,
    bathrooms: 5,
    size: "4800 sq ft",
    rating: 4.8,
    reviews: 67,
    amenities: ["Private Beach", "Infinity Pool", "Spa", "Chef's Kitchen", "Gardens", "Parking"],
    category: "ultra-luxury",
    features: ["Direct Beach Access", "Outdoor Kitchen", "Yoga Deck", "Private Dock"],
    owner: {
      name: "Coastal Retreats",
      rating: 4.8,
      verified: true,
      premium: true,
      responseTime: "10 min"
    },
    virtualTour: true,
    instantBooking: false,
    distance: "Beachfront",
    availableFrom: "2024-02-15",
    sustainability: ["Rainwater Harvesting", "Native Landscaping"],
    security: ["Gated Community", "Beach Security", "Alarm System"]
  },
  {
    id: 3,
    name: "Smart Executive Residence",
    price: "185,000",
    location: "Westlands, Nairobi",
    image: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
    images: [
      "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
    ],
    bedrooms: 3,
    bathrooms: 3,
    size: "1800 sq ft",
    rating: 4.7,
    reviews: 42,
    amenities: ["Rooftop Pool", "Business Center", "Fitness Studio", "Concierge", "Co-working"],
    category: "premium",
    features: ["Smart Home System", "City Views", "Balcony", "Walk-in Closet"],
    owner: {
      name: "Urban Prime",
      rating: 4.7,
      verified: true,
      premium: true,
      responseTime: "15 min"
    },
    virtualTour: true,
    instantBooking: true,
    distance: "0.8 km",
    availableFrom: "Immediately",
    sustainability: ["Energy Efficient", "Green Building"],
    security: ["Access Control", "Security Patrol"]
  },
  {
    id: 4,
    name: "Designer Loft with Terrace",
    price: "95,000",
    location: "Kileleshwa, Nairobi",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    images: [
      "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
      "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
    ],
    bedrooms: 2,
    bathrooms: 2,
    size: "1200 sq ft",
    rating: 4.6,
    reviews: 31,
    amenities: ["Private Terrace", "Smart Home", "Gym", "Pool", "Co-working"],
    category: "premium",
    features: ["Open Plan", "High Ceilings", "Terrace Garden", "Smart Lighting"],
    owner: {
      name: "Modern Spaces",
      rating: 4.6,
      verified: true,
      premium: true,
      responseTime: "20 min"
    },
    virtualTour: true,
    instantBooking: true,
    distance: "1.2 km",
    availableFrom: "2024-02-01",
    sustainability: ["LED Lighting", "Eco-friendly Materials"],
    security: ["Secure Parking", "Intercom"]
  }
];

export default function Featured() {
  const [rentals, setRentals] = useState(premiumRentals);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideUpAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 80, 160],
    outputRange: [0, 0.5, 1],
    extrapolate: 'clamp'
  });

  const filteredRentals = rentals.filter(rental => {
    const matchesFilter = activeFilter === 'all' || rental.category === activeFilter;
    const matchesSearch = rental.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         rental.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
  };

  const handleRentalPress = (rental: any) => {
    router.push({
      pathname: "/rental-details",
      params: { rental: JSON.stringify(rental) }
    });
  };

  const refreshRentals = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 1500);
  };

  const formatPrice = (price: string) => {
    return `Ksh ${parseInt(price.replace(/,/g, '')).toLocaleString()}/month`;
  };

  const getPriceCategory = (price: string) => {
    const priceNum = parseInt(price.replace(/,/g, ''));
    if (priceNum < 100000) return { label: "Premium", color: "#2E8B57", bgColor: "#e8f5e8" };
    if (priceNum < 300000) return { label: "Luxury", color: "#DAA520", bgColor: "#fff8e1" };
    return { label: "Ultra Luxury", color: "#FF6B35", bgColor: "#ffe8e8" };
  };

  const filters = [
    { id: 'all', label: 'All Premium', icon: 'diamond', count: rentals.length },
    { id: 'ultra-luxury', label: 'Ultra Luxury', icon: 'sparkles', count: rentals.filter(r => r.category === 'ultra-luxury').length },
    { id: 'premium', label: 'Premium', icon: 'star', count: rentals.filter(r => r.category === 'premium').length },
  ];

  const stats = [
    { value: "15.2K", label: "Premium Members", icon: "people", trend: "+12%" },
    { value: "4.8★", label: "Avg. Rating", icon: "star", trend: "+0.2" },
    { value: "98%", label: "Verified", icon: "shield-checkmark", trend: "+2%" },
    { value: "<15min", label: "Avg. Response", icon: "time", trend: "-5min" },
  ];

  const worldClassFeatures = [
    {
      icon: "globe",
      title: "Global Standards",
      description: "Properties meeting international luxury standards"
    },
    {
      icon: "shield-checkmark",
      title: "Verified Quality",
      description: "Every property undergoes 50+ quality checks"
    },
    {
      icon: "rocket",
      title: "Instant Booking",
      description: "Reserve premium properties instantly"
    },
    {
      icon: "videocam",
      title: "Virtual Tours",
      description: "3D property tours from anywhere"
    }
  ];

  const renderPremiumCard = (rental: any, index: number) => {
    const priceCategory = getPriceCategory(rental.price);
    
    return (
      <Animated.View
        key={rental.id}
        style={[
          styles.premiumCard,
          {
            opacity: fadeAnim,
            transform: [
              {
                translateY: fadeAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [50, 0]
                })
              }
            ]
          }
        ]}
      >
        <TouchableOpacity onPress={() => handleRentalPress(rental)} activeOpacity={0.95}>
          {/* Enhanced Image Section */}
          <View style={styles.cardMedia}>
            <Image source={{ uri: rental.image }} style={styles.cardImage} />
            
            {/* Premium Badges */}
            <View style={styles.mediaOverlay}>
              <View style={styles.badgeContainer}>
                <View style={[styles.categoryBadge, { backgroundColor: priceCategory.bgColor }]}>
                  <Ionicons name="diamond" size={12} color={priceCategory.color} />
                  <Text style={[styles.categoryText, { color: priceCategory.color }]}>
                    {priceCategory.label}
                  </Text>
                </View>
                
                {rental.virtualTour && (
                  <View style={styles.featureBadge}>
                    <Ionicons name="videocam" size={10} color="white" />
                    <Text style={styles.featureBadgeText}>3D TOUR</Text>
                  </View>
                )}
                
                {rental.instantBooking && (
                  <View style={styles.featureBadge}>
                    <Ionicons name="flash" size={10} color="white" />
                    <Text style={styles.featureBadgeText}>INSTANT</Text>
                  </View>
                )}
              </View>

              {/* Action Buttons */}
              <View style={styles.actionContainer}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={() => toggleFavorite(rental.id)}
                >
                  <Ionicons 
                    name={favorites.includes(rental.id) ? "heart" : "heart-outline"} 
                    size={20} 
                    color={favorites.includes(rental.id) ? "#ff4444" : "white"} 
                  />
                </TouchableOpacity>
                
                {rental.virtualTour && (
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons name="play" size={18} color="white" />
                  </TouchableOpacity>
                )}
              </View>
            </View>

            {/* Quick Stats Bar */}
            <View style={styles.statsBar}>
              <View style={styles.statPill}>
                <Ionicons name="bed" size={14} color="white" />
                <Text style={styles.statPillText}>{rental.bedrooms}</Text>
              </View>
              <View style={styles.statPill}>
                <Ionicons name="water" size={14} color="white" />
                <Text style={styles.statPillText}>{rental.bathrooms}</Text>
              </View>
              <View style={styles.statPill}>
                <Ionicons name="expand" size={14} color="white" />
                <Text style={styles.statPillText}>{rental.size}</Text>
              </View>
              <View style={styles.statPill}>
                <Ionicons name="location" size={14} color="white" />
                <Text style={styles.statPillText}>{rental.distance}</Text>
              </View>
            </View>
          </View>

          {/* Enhanced Content Section */}
          <View style={styles.cardContent}>
            {/* Header */}
            <View style={styles.contentHeader}>
              <View style={styles.titleSection}>
                <Text style={styles.propertyName} numberOfLines={2}>{rental.name}</Text>
                <View style={styles.ratingSection}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>{rental.rating}</Text>
                  <Text style={styles.reviews}>({rental.reviews})</Text>
                </View>
              </View>
            </View>

            {/* Location & Owner */}
            <View style={styles.metaSection}>
              <View style={styles.locationRow}>
                <Ionicons name="location" size={14} color="#666" />
                <Text style={styles.location}>{rental.location}</Text>
              </View>
              <View style={styles.ownerRow}>
                <Ionicons name="business" size={12} color="#2E8B57" />
                <Text style={styles.ownerName}>{rental.owner.name}</Text>
                <Text style={styles.responseTime}>• {rental.owner.responseTime}</Text>
              </View>
            </View>

            {/* Key Features */}
            <View style={styles.featuresGrid}>
              {rental.features.slice(0, 2).map((feature: string, idx: number) => (
                <View key={idx} style={styles.featureChip}>
                  <Ionicons name="checkmark-circle" size={12} color="#2E8B57" />
                  <Text style={styles.featureChipText}>{feature}</Text>
                </View>
              ))}
            </View>

            {/* Sustainability & Security */}
            <View style={styles.specsRow}>
              {rental.sustainability && (
                <View style={styles.specItem}>
                  <Ionicons name="leaf" size={12} color="#2E8B57" />
                  <Text style={styles.specText}>Eco-friendly</Text>
                </View>
              )}
              {rental.security && (
                <View style={styles.specItem}>
                  <Ionicons name="shield" size={12} color="#003366" />
                  <Text style={styles.specText}>Secure</Text>
                </View>
              )}
            </View>

            {/* Footer Actions */}
            <View style={styles.cardFooter}>
              <View style={styles.priceSection}>
                <Text style={[styles.price, { color: priceCategory.color }]}>
                  {formatPrice(rental.price)}
                </Text>
                <Text style={styles.availability}>Available {rental.availableFrom}</Text>
              </View>
              
              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.secondaryButton}>
                  <Ionicons name="chatbubble" size={16} color="#003366" />
                  <Text style={styles.secondaryButtonText}>Inquire</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={[
                    styles.primaryButton,
                    rental.instantBooking && styles.instantButton
                  ]}
                  onPress={() => handleRentalPress(rental)}
                >
                  <Ionicons 
                    name={rental.instantBooking ? "flash" : "eye"} 
                    size={16} 
                    color="white" 
                  />
                  <Text style={styles.primaryButtonText}>
                    {rental.instantBooking ? 'Book Now' : 'View'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* Enhanced Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerTitleSection}>
            <Ionicons name="diamond" size={20} color="#003366" />
            <Text style={styles.headerTitle}>Premium</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications" size={22} color="#003366" />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={refreshRentals}
            colors={["#003366"]}
            tintColor="#003366"
          />
        }
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Hero Section with Search */}
        <View style={styles.heroSection}>
          <Animated.View 
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideUpAnim }]
              }
            ]}
          >
            <Text style={styles.heroTitle}>World-Class Rentals</Text>
            <Text style={styles.heroSubtitle}>
              Discover exceptional properties that redefine luxury living
            </Text>
            
            {/* Smart Search */}
            <View style={styles.searchContainer}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search premium properties..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery('')}>
                  <Ionicons name="close-circle" size={20} color="#666" />
                </TouchableOpacity>
              )}
            </View>
          </Animated.View>
        </View>

        {/* Premium Stats */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideUpAnim }]
            }
          ]}
        >
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={styles.statHeader}>
                <View style={styles.statIcon}>
                  <Ionicons name={stat.icon as any} size={16} color="#003366" />
                </View>
                <Text style={styles.statTrend}>{stat.trend}</Text>
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </Animated.View>

        {/* Smart Filter Tabs */}
        <View style={styles.filterSection}>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterContent}
          >
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.id}
                style={[
                  styles.filterChip,
                  activeFilter === filter.id && styles.filterChipActive
                ]}
                onPress={() => setActiveFilter(filter.id)}
              >
                <Ionicons 
                  name={filter.icon as any} 
                  size={16} 
                  color={activeFilter === filter.id ? "white" : "#003366"} 
                />
                <Text style={[
                  styles.filterText,
                  activeFilter === filter.id && styles.filterTextActive
                ]}>
                  {filter.label}
                </Text>
                <View style={[
                  styles.filterCount,
                  activeFilter === filter.id && styles.filterCountActive
                ]}>
                  <Text style={styles.filterCountText}>{filter.count}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* World-Class Features */}
        <View style={styles.featuresSection}>
          <Text style={styles.featuresTitle}>Why We're World-Class</Text>
          <View style={styles.featuresGrid}>
            {worldClassFeatures.map((feature, index) => (
              <View key={index} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <Ionicons name={feature.icon as any} size={24} color="#003366" />
                </View>
                <Text style={styles.featureCardTitle}>{feature.title}</Text>
                <Text style={styles.featureCardDescription}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Premium Properties Grid */}
        <View style={styles.propertiesSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>
              {filteredRentals.length} Premium Properties
            </Text>
            <Text style={styles.sectionSubtitle}>
              Hand-curated for exceptional living experiences
            </Text>
          </View>

          <View style={styles.propertiesGrid}>
            {filteredRentals.map(renderPremiumCard)}
          </View>
        </View>

        {/* Premium CTA */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>Ready for Premium Living?</Text>
          <Text style={styles.ctaDescription}>
            Join thousands of discerning residents who trust Hama Bwana for exceptional rental experiences
          </Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Text style={styles.ctaButtonText}>Explore All Premium</Text>
            <Ionicons name="arrow-forward" size={18} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  animatedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 90,
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 40,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    })
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  headerTitleSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#003366',
    marginLeft: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  heroSection: {
    backgroundColor: "#003366",
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  heroContent: {
    alignItems: 'center',
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: 'center',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255,255,255,0.8)",
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 25,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    width: '100%',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    })
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 12,
    marginTop: -40,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
      },
      android: {
        elevation: 6,
      },
    })
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  statIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
  },
  statTrend: {
    fontSize: 12,
    fontWeight: "700",
    color: "#2E8B57",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  filterContent: {
    gap: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 25,
    marginRight: 8,
    borderWidth: 2,
    borderColor: '#e9ecef',
  },
  filterChipActive: {
    backgroundColor: '#003366',
    borderColor: '#003366',
  },
  filterText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#003366',
    marginLeft: 8,
    marginRight: 8,
  },
  filterTextActive: {
    color: 'white',
  },
  filterCount: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  filterCountActive: {
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  filterCountText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#003366',
  },
  featuresSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003366",
    textAlign: 'center',
    marginBottom: 20,
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  featureCard: {
    width: (SCREEN_WIDTH - 55) / 2,
    backgroundColor: "white",
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    })
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  featureCardTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#003366",
    textAlign: 'center',
    marginBottom: 8,
  },
  featureCardDescription: {
    fontSize: 12,
    color: "#666",
    textAlign: 'center',
    lineHeight: 16,
  },
  propertiesSection: {
    paddingHorizontal: 15,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
  },
  propertiesGrid: {
    gap: 25,
  },
  premiumCard: {
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
    })
  },
  cardMedia: {
    position: "relative",
  },
  cardImage: {
    width: "100%",
    height: 240,
  },
  mediaOverlay: {
    ...StyleSheet.absoluteFillObject,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: "800",
    marginLeft: 4,
  },
  featureBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  featureBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  actionContainer: {
    gap: 8,
  },
  iconButton: {
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  statsBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 12,
  },
  statPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statPillText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
  },
  cardContent: {
    padding: 20,
  },
  contentHeader: {
    marginBottom: 12,
  },
  titleSection: {
    marginBottom: 8,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003366",
    lineHeight: 24,
    marginBottom: 8,
  },
  ratingSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "700",
    color: "#003366",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  metaSection: {
    marginBottom: 12,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 6,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  ownerName: {
    fontSize: 12,
    color: "#2E8B57",
    fontWeight: "600",
    marginLeft: 4,
  },
  responseTime: {
    fontSize: 11,
    color: "#666",
  },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 12,
  },
  featureChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  featureChipText: {
    fontSize: 12,
    color: "#003366",
    fontWeight: "500",
  },
  specsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 20,
  },
  specItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  specText: {
    fontSize: 11,
    color: "#666",
    fontWeight: "500",
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 16,
  },
  priceSection: {
    marginBottom: 16,
  },
  price: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  availability: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },
  secondaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#003366",
    gap: 6,
  },
  secondaryButtonText: {
    color: "#003366",
    fontWeight: "600",
    fontSize: 14,
  },
  primaryButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#003366",
    padding: 12,
    borderRadius: 12,
    gap: 6,
  },
  instantButton: {
    backgroundColor: "#FF6B35",
  },
  primaryButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  ctaSection: {
    backgroundColor: "#003366",
    margin: 20,
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#FFFFFF",
    textAlign: 'center',
    marginBottom: 12,
  },
  ctaDescription: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ctaButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  ctaButtonText: {
    color: "#003366",
    fontSize: 16,
    fontWeight: "700",
  },
  bottomSpacer: {
    height: 30,
  },
});