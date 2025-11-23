// app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
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

// Enhanced sample data with Kenyan focus
const featuredRentals = [
  {
    id: 1,
    title: "Luxury 2 Bedroom Apartment with City Views",
    price: "45,000",
    location: "Kilimani, Nairobi",
    image: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.8,
    reviews: 24,
    isFeatured: true,
    size: "1200 sq ft",
    amenities: ["WiFi", "Parking", "Security", "Gym"],
    verified: true,
    instantBooking: true,
    distance: "1.2 km",
    owner: {
      name: "John Kamau",
      rating: 4.9,
      properties: 12
    },
    popular: true,
    discount: "5% off first month"
  },
  {
    id: 2,
    title: "Modern Studio with Smart Home Features",
    price: "18,000",
    location: "Westlands, Nairobi",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    bedrooms: 1,
    bathrooms: 1,
    rating: 4.5,
    reviews: 18,
    isFeatured: true,
    size: "600 sq ft",
    amenities: ["WiFi", "Gym", "Pool", "AC"],
    verified: true,
    instantBooking: false,
    distance: "2.5 km",
    owner: {
      name: "Sarah Mwangi",
      rating: 4.7,
      properties: 8
    },
    popular: false,
    discount: null
  },
  {
    id: 3,
    title: "Executive 3 Bedroom Villa with Garden",
    price: "120,000",
    location: "Karen, Nairobi",
    image: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg",
    bedrooms: 3,
    bathrooms: 3,
    rating: 4.9,
    reviews: 32,
    isFeatured: true,
    size: "2000 sq ft",
    amenities: ["Garden", "Parking", "Security", "Pool", "Gym"],
    verified: true,
    instantBooking: true,
    distance: "5.8 km",
    owner: {
      name: "David Ochieng",
      rating: 4.8,
      properties: 15
    },
    popular: true,
    discount: "Free first month utilities"
  },
];

const categories = [
  { id: 1, name: "Apartments", icon: "business", count: "1,247", color: "#003366", gradient: ["#003366", "#0044CC"] },
  { id: 2, name: "Houses", icon: "home", count: "892", color: "#2E8B57", gradient: ["#2E8B57", "#32CD32"] },
  { id: 3, name: "Bedsitters", icon: "bed", count: "673", color: "#FF6B35", gradient: ["#FF6B35", "#FF8C00"] },
  { id: 4, name: "Studios", icon: "square", count: "458", color: "#DAA520", gradient: ["#DAA520", "#FFD700"] },
  { id: 5, name: "Commercial", icon: "briefcase", count: "324", color: "#9C27B0", gradient: ["#9C27B0", "#E91E63"] },
  { id: 6, name: "Luxury", icon: "diamond", count: "287", color: "#E91E63", gradient: ["#E91E63", "#FF4081"] },
];

const locations = [
  { name: "Nairobi", properties: "2,458", image: "https://images.pexels.com/photos/2363/france-urban-city-construction.jpg", growth: "+12%" },
  { name: "Mombasa", properties: "1,234", image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg", growth: "+8%" },
  { name: "Kisumu", properties: "856", image: "https://images.pexels.com/photos/2118126/pexels-photo-2118126.jpeg", growth: "+15%" },
  { name: "Nakuru", properties: "723", image: "https://images.pexels.com/photos/235732/pexels-photo-235732.jpeg", growth: "+18%" },
  { name: "Eldoret", properties: "589", image: "https://images.pexels.com/photos/235732/pexels-photo-235732.jpeg", growth: "+10%" },
  { name: "Thika", properties: "467", image: "https://images.pexels.com/photos/235732/pexels-photo-235732.jpeg", growth: "+22%" },
];

const stats = [
  { value: "50K+", label: "Properties", icon: "business", change: "+12%", description: "Across Kenya" },
  { value: "24", label: "Cities", icon: "location", change: "+3", description: "Nationwide" },
  { value: "98%", label: "Satisfaction", icon: "heart", change: "+2%", description: "Happy users" },
  { value: "15min", label: "Avg Response", icon: "time", change: "-5min", description: "Fast support" },
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("Nairobi");
  const [activeCategory, setActiveCategory] = useState("all");
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 100,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const handleRentalPress = (rental: any) => {
    console.log("Viewing rental:", rental.title);
    // You can add navigation to rental detail screen here
    // router.push(`/rental/${rental.id}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/(tabs)/explore?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const quickActions = [
    {
      title: "Publish Rental",
      icon: "add-circle",
      description: "List your property",
      color: "#003366",
      gradient: ["#003366", "#0044CC"],
      onPress: () => router.push("/publish")
    },
    {
      title: "Smart Search",
      icon: "search",
      description: "AI-powered search",
      color: "#2E8B57",
      gradient: ["#2E8B57", "#32CD32"],
      onPress: () => router.push("/(tabs)/explore")
    },
    {
      title: "Virtual Tours",
      icon: "videocam",
      description: "3D property views",
      color: "#FF6B35",
      gradient: ["#FF6B35", "#FF8C00"],
      onPress: () => console.log("Virtual Tours")
    },
    {
      title: "Price Insights",
      icon: "trending-up",
      description: "Market analytics",
      color: "#DAA520",
      gradient: ["#DAA520", "#FFD700"],
      onPress: () => console.log("Price Insights")
    },
  ];

  const renderFeaturedCard = (rental: any, index: number) => (
    <Animated.View
      key={rental.id}
      style={[
        styles.featuredCard,
        {
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [100, 0]
              })
            },
            { scale: scaleAnim }
          ]
        }
      ]}
    >
      <TouchableOpacity onPress={() => handleRentalPress(rental)} activeOpacity={0.9}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: rental.image }} style={styles.featuredImage} />
          
          {/* Premium Badges */}
          <View style={styles.cardBadges}>
            {rental.isFeatured && (
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={12} color="white" />
                <Text style={styles.featuredBadgeText}>FEATURED</Text>
              </View>
            )}
            {rental.verified && (
              <View style={styles.verifiedBadge}>
                <Ionicons name="shield-checkmark" size={12} color="white" />
                <Text style={styles.verifiedBadgeText}>VERIFIED</Text>
              </View>
            )}
            {rental.popular && (
              <View style={styles.popularBadge}>
                <Ionicons name="flame" size={12} color="white" />
                <Text style={styles.popularBadgeText}>TRENDING</Text>
              </View>
            )}
          </View>

          {/* Discount Badge */}
          {rental.discount && (
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>{rental.discount}</Text>
            </View>
          )}

          {/* Favorite Button */}
          <TouchableOpacity style={styles.favoriteButton}>
            <Ionicons name="heart-outline" size={20} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.featuredContent}>
          <View style={styles.featuredHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.featuredTitle} numberOfLines={2}>{rental.title}</Text>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#FFD700" />
                <Text style={styles.rating}>{rental.rating}</Text>
                <Text style={styles.reviews}>({rental.reviews})</Text>
              </View>
            </View>
          </View>

          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.featuredLocation}>{rental.location}</Text>
            <Text style={styles.distance}>• {rental.distance}</Text>
          </View>

          <View style={styles.featuredDetails}>
            <View style={styles.detailItem}>
              <Ionicons name="bed" size={18} color="#003366" />
              <Text style={styles.detailText}>{rental.bedrooms} bed</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="water" size={18} color="#003366" />
              <Text style={styles.detailText}>{rental.bathrooms} bath</Text>
            </View>
            <View style={styles.detailItem}>
              <Ionicons name="expand" size={18} color="#003366" />
              <Text style={styles.detailText}>{rental.size}</Text>
            </View>
          </View>

          <View style={styles.amenities}>
            {rental.amenities.slice(0, 3).map((amenity: string, idx: number) => (
              <View key={idx} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
            {rental.amenities.length > 3 && (
              <Text style={styles.moreAmenities}>+{rental.amenities.length - 3}</Text>
            )}
          </View>

          <View style={styles.priceSection}>
            <View>
              <Text style={styles.price}>Ksh {rental.price}</Text>
              <Text style={styles.pricePeriod}>/month</Text>
            </View>
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.contactButton}>
                <Ionicons name="chatbubble" size={18} color="#003366" />
                <Text style={styles.contactButtonText}>Inquire</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tourButton}>
                <Ionicons name="videocam" size={18} color="white" />
                <Text style={styles.tourButtonText}>Tour</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <View style={styles.headerContent}>
          <View style={styles.logoContainer}>
            <Ionicons name="home" size={24} color="#003366" />
            <Text style={styles.headerTitle}>Hama Bwana</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Ionicons name="notifications-outline" size={22} color="#003366" />
            <View style={styles.notificationDot} />
          </TouchableOpacity>
        </View>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
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
        {/* Main Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Animated.View 
              style={[
                styles.welcomeSection,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }]
                }
              ]}
            >
              <Text style={styles.greeting}>Karibu! 👋</Text>
              <Text style={styles.userName}>Find Your Perfect Home in Kenya</Text>
              <Text style={styles.welcomeSubtitle}>50,000+ verified properties nationwide</Text>
            </Animated.View>
            
            <TouchableOpacity 
              style={styles.profileButton}
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View style={styles.profilePlaceholder}>
                <Ionicons name="person" size={20} color="#003366" />
              </View>
              <View style={styles.notificationBadge}>
                <Text style={styles.notificationText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Smart Search Bar */}
          <Animated.View 
            style={[
              styles.searchContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <View style={styles.searchInputContainer}>
              <Ionicons name="search" size={20} color="#666" />
              <TextInput
                style={styles.searchInput}
                placeholder="Search location, price, amenities..."
                placeholderTextColor="#999"
                value={searchQuery}
                onChangeText={setSearchQuery}
                onSubmitEditing={handleSearch}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity 
              style={styles.searchButton}
              onPress={handleSearch}
            >
              <Ionicons name="arrow-forward" size={20} color="white" />
            </TouchableOpacity>
          </Animated.View>
        </View>

        {/* Premium Stats */}
        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCard}>
              <View style={[styles.statIcon, { backgroundColor: `${stat.color}15` }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={styles.statDescription}>{stat.description}</Text>
              <View style={styles.statChange}>
                <Ionicons name="trending-up" size={12} color="#2E8B57" />
                <Text style={styles.statChangeText}>{stat.change}</Text>
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.actionsScroll}
            contentContainerStyle={styles.actionsContent}
          >
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: action.color }]}
                onPress={action.onPress}
              >
                <View style={styles.actionIcon}>
                  <Ionicons name={action.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse Categories</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.categoriesScroll}
            contentContainerStyle={styles.categoriesContent}
          >
            {categories.map((category, index) => (
              <TouchableOpacity 
                key={category.id} 
                style={[
                  styles.categoryCard,
                  { backgroundColor: category.color }
                ]}
                onPress={() => setActiveCategory(category.name.toLowerCase())}
              >
                <View style={styles.categoryIcon}>
                  <Ionicons name={category.icon as any} size={24} color="white" />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
                <Text style={styles.categoryCount}>{category.count} properties</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Popular Locations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Locations</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/map")}>
              <Text style={styles.seeAllText}>View Map</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.locationsScroll}
            contentContainerStyle={styles.locationsContent}
          >
            {locations.map((location, index) => (
              <TouchableOpacity
                key={index}
                style={styles.locationCard}
                onPress={() => setSelectedLocation(location.name)}
              >
                <Image source={{ uri: location.image }} style={styles.locationImage} />
                <View style={styles.locationOverlay} />
                <View style={styles.locationContent}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationProperties}>{location.properties} properties</Text>
                  <View style={styles.growthBadge}>
                    <Text style={styles.growthText}>{location.growth}</Text>
                  </View>
                </View>
                {selectedLocation === location.name && (
                  <View style={styles.selectedIndicator}>
                    <Ionicons name="checkmark" size={16} color="white" />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Rentals */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Premium Properties</Text>
            <TouchableOpacity onPress={() => router.push("/(tabs)/explore")}>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.featuredGrid}>
            {featuredRentals.map(renderFeaturedCard)}
          </View>
        </View>

        {/* AI Recommendation Section */}
        <View style={styles.aiSection}>
          <View style={styles.aiHeader}>
            <Ionicons name="sparkles" size={24} color="#003366" />
            <Text style={styles.aiTitle}>AI Smart Recommendations</Text>
          </View>
          <Text style={styles.aiDescription}>
            Our AI analyzes your preferences to show you properties you'll love across Kenya
          </Text>
          <TouchableOpacity style={styles.aiButton}>
            <Text style={styles.aiButtonText}>Get Personalized Matches</Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Premium Floating Action Button */}
      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => router.push("/publish")}
      >
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
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
  },
  logoContainer: {
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
    position: 'relative',
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FF4444',
  },
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  welcomeSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 16,
    color: "#666",
    marginBottom: 4,
    fontWeight: '600',
  },
  userName: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: "#666",
    fontWeight: '500',
  },
  profileButton: {
    position: "relative",
  },
  profilePlaceholder: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#003366',
  },
  notificationBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF4444",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "white",
  },
  notificationText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#f0f4ff",
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    })
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: '500',
  },
  searchButton: {
    backgroundColor: "#003366",
    width: 50,
    height: '100%',
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003366",
    letterSpacing: -0.3,
  },
  seeAllText: {
    color: "#0033A0",
    fontWeight: "700",
    fontSize: 14,
  },
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: "white",
    padding: 16,
    borderRadius: 16,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    })
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "800",
    color: "#003366",
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: '600',
    marginBottom: 2,
  },
  statDescription: {
    fontSize: 12,
    color: "#999",
    marginBottom: 4,
  },
  statChange: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statChangeText: {
    fontSize: 12,
    color: "#2E8B57",
    fontWeight: "600",
    marginLeft: 4,
  },
  actionsScroll: {
    marginBottom: 10,
  },
  actionsContent: {
    paddingHorizontal: 15,
  },
  actionCard: {
    width: 160,
    backgroundColor: "#003366",
    borderRadius: 20,
    padding: 20,
    marginRight: 12,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    })
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  categoriesScroll: {
    marginBottom: 10,
  },
  categoriesContent: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    alignItems: "center",
    borderRadius: 20,
    padding: 20,
    marginRight: 12,
    width: 140,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    })
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },
  locationsScroll: {
    marginBottom: 10,
  },
  locationsContent: {
    paddingHorizontal: 15,
  },
  locationCard: {
    width: 140,
    height: 180,
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
    position: "relative",
  },
  locationImage: {
    width: "100%",
    height: "100%",
  },
  locationOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  locationContent: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    marginBottom: 2,
  },
  locationProperties: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  growthBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#2E8B57',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  growthText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '700',
  },
  selectedIndicator: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "#003366",
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  featuredGrid: {
    paddingHorizontal: 15,
    gap: 20,
  },
  featuredCard: {
    backgroundColor: "white",
    borderRadius: 24,
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
    })
  },
  cardHeader: {
    position: "relative",
  },
  featuredImage: {
    width: "100%",
    height: 220,
  },
  cardBadges: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    gap: 8,
  },
  featuredBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003366",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  verifiedBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#2E8B57",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  verifiedBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  popularBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FF6B35",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  popularBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  discountBadge: {
    position: "absolute",
    top: 12,
    right: 60,
    backgroundColor: "#DAA520",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  discountText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
  },
  favoriteButton: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(0,0,0,0.5)",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  featuredContent: {
    padding: 16,
  },
  featuredHeader: {
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    flex: 1,
    marginRight: 8,
  },
  ratingContainer: {
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
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featuredLocation: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  distance: {
    fontSize: 14,
    color: "#999",
    marginLeft: 4,
  },
  featuredDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  amenities: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  amenityTag: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
  },
  amenityText: {
    fontSize: 12,
    color: "#003366",
    fontWeight: "500",
  },
  moreAmenities: {
    fontSize: 12,
    color: "#999",
    fontWeight: "500",
  },
  priceSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "800",
    color: "#003366",
  },
  pricePeriod: {
    fontSize: 12,
    color: "#666",
  },
  actionButtons: {
    flexDirection: "row",
    gap: 8,
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  contactButtonText: {
    fontSize: 14,
    color: "#003366",
    fontWeight: "600",
  },
  tourButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003366",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    gap: 4,
  },
  tourButtonText: {
    fontSize: 14,
    color: "white",
    fontWeight: "600",
  },
  aiSection: {
    backgroundColor: "#f8f9ff",
    marginHorizontal: 20,
    marginBottom: 30,
    padding: 24,
    borderRadius: 20,
    alignItems: "center",
  },
  aiHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginLeft: 8,
  },
  aiDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 16,
    lineHeight: 20,
  },
  aiButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#003366",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  aiButtonText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600",
  },
  bottomSpacer: {
    height: 30,
  },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#003366",
    justifyContent: "center",
    alignItems: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    })
  },
});