// app/(tabs)/index.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get('window');

// Sample data
const featuredRentals = [
  {
    id: 1,
    title: "Modern 2 Bedroom Apartment",
    price: "35,000",
    location: "Kilimani, Nairobi",
    image: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
    bedrooms: 2,
    bathrooms: 2,
    rating: 4.8,
    isFeatured: true,
    size: "1200 sq ft"
  },
  {
    id: 2,
    title: "Luxury Studio Bedsitter",
    price: "12,000",
    location: "Westlands, Nairobi",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    bedrooms: 1,
    bathrooms: 1,
    rating: 4.5,
    isFeatured: true,
    size: "600 sq ft"
  },
  {
    id: 3,
    title: "3 Bedroom Luxury House",
    price: "80,000",
    location: "Nyali, Mombasa",
    image: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg",
    bedrooms: 3,
    bathrooms: 3,
    rating: 4.9,
    isFeatured: true,
    size: "2000 sq ft"
  },
];

const categories = [
  { id: 1, name: "Apartments", icon: "business", count: "124" },
  { id: 2, name: "Houses", icon: "home", count: "89" },
  { id: 3, name: "Bedsitters", icon: "bed", count: "67" },
  { id: 4, name: "Studios", icon: "square", count: "45" },
  { id: 5, name: "Commercial", icon: "briefcase", count: "32" },
  { id: 6, name: "Luxury", icon: "diamond", count: "28" },
];

const locations = [
  "Nairobi", "Mombasa", "Kisumu", "Nakuru", "Eldoret", "Thika"
];

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [user, setUser] = useState({
    name: "Engineer Mathias",
    profilePic: require("../assets/profile.png"),
  });
  const [selectedLocation, setSelectedLocation] = useState("Nairobi");

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Refreshed", "Latest properties loaded!");
    }, 2000);
  };

  const handleRentalPress = (rental: any) => {
    router.push({
      pathname: "/rental-details",
      params: { rental: JSON.stringify(rental) }
    });
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert("Search", `Searching for: ${searchQuery}`);
      // TODO: Implement actual search functionality
    } else {
      Alert.alert("Search", "Please enter a search term");
    }
  };

  const handleContactOwner = (rental: any, event: any) => {
    event?.stopPropagation(); // Prevent navigation to rental details
    Alert.alert(
      "Contact Owner",
      `Contact the owner of "${rental.title}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Call", onPress: () => console.log("Call owner") },
        { text: "Message", onPress: () => console.log("Message owner") }
      ]
    );
  };

  const quickActions = [
    {
      title: "Publish Rental",
      icon: "add-circle",
      color: "#0033A0",
      onPress: () => router.push("/publish")
    },
    {
      title: "View Map",
      icon: "map",
      color: "#2E8B57",
      onPress: () => router.push("/(tabs)/map")
    },
    {
      title: "Favorites",
      icon: "heart",
      color: "#FF6B35",
      onPress: () => Alert.alert("Favorites", "Your favorite rentals will appear here")
    },
    {
      title: "Messages",
      icon: "chatbubbles",
      color: "#DAA520",
      onPress: () => Alert.alert("Messages", "Your messages will appear here")
    },
  ];

  const stats = [
    { value: "2,458", label: "Properties" },
    { value: "1,234", label: "Happy Tenants" },
    { value: "856", label: "Active Owners" },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.greeting}>Good morning 👋</Text>
            <Text style={styles.userName}>{user.name}</Text>
          </View>
          <TouchableOpacity 
            style={styles.profileButton}
            onPress={() => router.push("/(tabs)/profile")}
          >
            <Image source={user.profilePic} style={styles.profileImage} />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TouchableOpacity onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#666" />
          </TouchableOpacity>
          <TextInput
            style={styles.searchInput}
            placeholder="Search for rentals, locations..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity 
            style={styles.filterButton} 
            onPress={() => Alert.alert("Filters", "Filter options coming soon!")}
          >
            <Ionicons name="options" size={20} color="#003366" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={onRefresh}
            colors={["#0033A0"]}
            tintColor="#0033A0"
          />
        }
      >
        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionsGrid}>
          {quickActions.map((action, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionCard}
              onPress={action.onPress}
            >
              <View style={[styles.actionIcon, { backgroundColor: action.color }]}>
                <Ionicons name={action.icon as any} size={24} color="white" />
              </View>
              <Text style={styles.actionText}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Categories</Text>
          <TouchableOpacity onPress={() => Alert.alert("Categories", "All categories coming soon!")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesScroll}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
              onPress={() => Alert.alert(category.name, `${category.count} properties available`)}
            >
              <View style={styles.categoryIcon}>
                <Ionicons name={category.icon as any} size={24} color="#003366" />
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
              <Text style={styles.categoryCount}>{category.count} properties</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Popular Locations */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Locations</Text>
          <TouchableOpacity onPress={() => Alert.alert("Locations", "All locations coming soon!")}>
            <Text style={styles.seeAllText}>View All</Text>
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
              style={[
                styles.locationChip,
                selectedLocation === location && styles.locationChipActive
              ]}
              onPress={() => setSelectedLocation(location)}
            >
              <Ionicons 
                name="location" 
                size={16} 
                color={selectedLocation === location ? "white" : "#003366"} 
              />
              <Text style={[
                styles.locationText,
                selectedLocation === location && styles.locationTextActive
              ]}>
                {location}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Featured Rentals */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Featured Rentals</Text>
          <TouchableOpacity onPress={() => router.push("/(tabs)/featured")}>
            <Text style={styles.seeAllText}>See All</Text>
          </TouchableOpacity>
        </View>

        {featuredRentals.map((rental) => (
          <TouchableOpacity
            key={rental.id}
            style={styles.featuredCard}
            onPress={() => handleRentalPress(rental)}
            activeOpacity={0.9}
          >
            <Image source={{ uri: rental.image }} style={styles.featuredImage} />
            
            {/* Featured Badge */}
            {rental.isFeatured && (
              <View style={styles.featuredBadge}>
                <Ionicons name="star" size={12} color="white" />
                <Text style={styles.featuredBadgeText}>FEATURED</Text>
              </View>
            )}

            <View style={styles.featuredContent}>
              <View style={styles.featuredHeader}>
                <Text style={styles.featuredTitle}>{rental.title}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={16} color="#FFD700" />
                  <Text style={styles.rating}>{rental.rating}</Text>
                </View>
              </View>

              <View style={styles.locationContainer}>
                <Ionicons name="location-outline" size={14} color="#666" />
                <Text style={styles.featuredLocation}>{rental.location}</Text>
              </View>

              <View style={styles.featuredDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="bed-outline" size={16} color="#003366" />
                  <Text style={styles.detailText}>{rental.bedrooms} Bed</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="water-outline" size={16} color="#003366" />
                  <Text style={styles.detailText}>{rental.bathrooms} Bath</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="square-outline" size={16} color="#003366" />
                  <Text style={styles.detailText}>{rental.size}</Text>
                </View>
              </View>

              <View style={styles.priceContainer}>
                <Text style={styles.price}>Ksh {rental.price}/month</Text>
                <TouchableOpacity 
                  style={styles.contactButton}
                  onPress={(e) => handleContactOwner(rental, e)}
                >
                  <Ionicons name="chatbubble-ellipses" size={16} color="#003366" />
                  <Text style={styles.contactButtonText}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Why Choose Us */}
        <View style={styles.whyUsSection}>
          <Text style={styles.sectionTitle}>Why Choose Hama Bwana?</Text>
          <View style={styles.featuresGrid}>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="shield-checkmark" size={24} color="#003366" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Verified Properties</Text>
                <Text style={styles.featureDescription}>
                  All listings are thoroughly verified for authenticity and quality standards.
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="lock-closed" size={24} color="#003366" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Secure Payments</Text>
                <Text style={styles.featureDescription}>
                  Safe and secure payment processing with multiple payment options.
                </Text>
              </View>
            </View>
            <View style={styles.featureItem}>
              <View style={styles.featureIcon}>
                <Ionicons name="headset" size={24} color="#003366" />
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>24/7 Support</Text>
                <Text style={styles.featureDescription}>
                  Round-the-clock customer support for all your rental needs.
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
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
  header: {
    backgroundColor: "#ffffff",
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greeting: {
    fontSize: 14,
    color: "#666",
  },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
  },
  profileButton: {
    position: "relative",
  },
  profileImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: "#0033A0",
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
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  filterButton: {
    padding: 4,
  },
  scrollView: {
    flex: 1,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 20,
    backgroundColor: "#f8f9fa",
    margin: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
  },
  seeAllText: {
    color: "#0033A0",
    fontWeight: "600",
    fontSize: 14,
  },
  actionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 15,
    marginBottom: 25,
  },
  actionCard: {
    width: (width - 60) / 2,
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    margin: 7.5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  actionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    textAlign: "center",
  },
  categoriesScroll: {
    marginBottom: 25,
  },
  categoriesContent: {
    paddingHorizontal: 15,
  },
  categoryCard: {
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginRight: 12,
    width: 100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  categoryIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    textAlign: "center",
    marginBottom: 4,
  },
  categoryCount: {
    fontSize: 12,
    color: "#666",
  },
  locationsScroll: {
    marginBottom: 25,
  },
  locationsContent: {
    paddingHorizontal: 15,
  },
  locationChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  locationChipActive: {
    backgroundColor: "#0033A0",
    borderColor: "#0033A0",
  },
  locationText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#003366",
    marginLeft: 4,
  },
  locationTextActive: {
    color: "white",
  },
  featuredCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginHorizontal: 20,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  featuredImage: {
    width: "100%",
    height: 200,
  },
  featuredBadge: {
    position: "absolute",
    top: 12,
    left: 12,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#0033A0",
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
  featuredContent: {
    padding: 16,
  },
  featuredHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    flex: 1,
    marginRight: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    marginLeft: 4,
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
  featuredDetails: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 15,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: "#f0f0f0",
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailText: {
    fontSize: 14,
    color: "#003366",
    marginLeft: 6,
    fontWeight: "500",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
    color: "#DAA520",
  },
  contactButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0033A0",
  },
  contactButtonText: {
    color: "#003366",
    fontWeight: "600",
    marginLeft: 6,
  },
  whyUsSection: {
    padding: 20,
    backgroundColor: "#f8f9fa",
    margin: 20,
    borderRadius: 16,
  },
  featuresGrid: {
    marginTop: 15,
  },
  featureItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  featureIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f0f4ff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
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
    backgroundColor: "#0033A0",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
});