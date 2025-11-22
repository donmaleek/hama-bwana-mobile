// app/(tabs)/explore.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width } = Dimensions.get('window');

// Sample data for explore screen
const popularSearches = [
  { id: 1, term: "2 Bedroom Apartments", count: "234" },
  { id: 2, term: "Studio near University", count: "189" },
  { id: 3, term: "Houses with Parking", count: "156" },
  { id: 4, term: "Pet Friendly Rentals", count: "98" },
  { id: 5, term: "Luxury Apartments", count: "76" },
  { id: 6, term: "Furnished Bedsitters", count: "143" },
];

const trendingLocations = [
  {
    id: 1,
    name: "Kilimani",
    city: "Nairobi",
    image: "https://images.pexels.com/photos/259588/pexels-photo-259588.jpeg",
    properties: "124",
    avgPrice: "45,000"
  },
  {
    id: 2,
    name: "Westlands",
    city: "Nairobi",
    image: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
    properties: "98",
    avgPrice: "52,000"
  },
  {
    id: 3,
    name: "Nyali",
    city: "Mombasa",
    image: "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg",
    properties: "67",
    avgPrice: "38,000"
  },
  {
    id: 4,
    name: "Nakuru CBD",
    city: "Nakuru",
    image: "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg",
    properties: "89",
    avgPrice: "22,000"
  },
];

const propertyTypes = [
  {
    id: 1,
    name: "Apartments",
    icon: "business",
    count: "458",
    description: "Modern apartments in secure compounds"
  },
  {
    id: 2,
    name: "Houses",
    icon: "home",
    count: "289",
    description: "Standalone houses with compounds"
  },
  {
    id: 3,
    name: "Bedsitters",
    icon: "bed",
    count: "367",
    description: "Affordable single-room units"
  },
  {
    id: 4,
    name: "Studios",
    icon: "square",
    count: "234",
    description: "Compact living spaces"
  },
  {
    id: 5,
    name: "Commercial",
    icon: "briefcase",
    count: "156",
    description: "Office and retail spaces"
  },
  {
    id: 6,
    name: "Luxury",
    icon: "diamond",
    count: "89",
    description: "Premium properties"
  },
];

const priceRanges = [
  { id: 1, range: "Under Ksh 15,000", min: 0, max: 15000 },
  { id: 2, range: "Ksh 15,000 - 30,000", min: 15000, max: 30000 },
  { id: 3, range: "Ksh 30,000 - 50,000", min: 30000, max: 50000 },
  { id: 4, range: "Ksh 50,000 - 100,000", min: 50000, max: 100000 },
  { id: 5, range: "Over Ksh 100,000", min: 100000, max: 1000000 },
];

const recentlyViewed = [
  {
    id: 1,
    name: "Spacious 3 Bedroom",
    price: "65,000",
    location: "Lavington, Nairobi",
    image: "https://images.pexels.com/photos/106399/pexels-photo-106399.jpeg",
    viewed: "2 hours ago"
  },
  {
    id: 2,
    name: "Modern Studio",
    price: "18,000",
    location: "South B, Nairobi",
    image: "https://images.pexels.com/photos/271816/pexels-photo-271816.jpeg",
    viewed: "1 day ago"
  },
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [selectedPriceRange, setSelectedPriceRange] = useState<number | null>(null);
  const [selectedPropertyType, setSelectedPropertyType] = useState<number | null>(null);

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Refreshed", "Latest trends updated!");
    }, 1500);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      Alert.alert("Search", `Searching for: ${searchQuery}`);
      // TODO: Implement search functionality
    } else {
      Alert.alert("Search", "Please enter a search term");
    }
  };

  const handlePopularSearch = (search: any) => {
    setSearchQuery(search.term);
    Alert.alert("Search", `Searching for: ${search.term} (${search.count} properties)`);
  };

  const handleLocationPress = (location: any) => {
    router.push({
      pathname: "/(tabs)/map",
      params: { location: JSON.stringify(location) }
    });
  };

  const handlePropertyTypePress = (type: any) => {
    setSelectedPropertyType(type.id === selectedPropertyType ? null : type.id);
    Alert.alert("Filter", `Showing ${type.name} properties`);
  };

  const handlePriceRangePress = (range: any) => {
    setSelectedPriceRange(range.id === selectedPriceRange ? null : range.id);
    Alert.alert("Filter", `Price range: ${range.range}`);
  };

  const handleAdvancedSearch = () => {
    Alert.alert(
      "Advanced Search",
      "Customize your search with multiple filters",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Apply Filters", onPress: () => console.log("Apply advanced filters") }
      ]
    );
  };

  const handleRentalPress = (rental: any) => {
    router.push({
      pathname: "/rental-details",
      params: { rental: JSON.stringify(rental) }
    });
  };

  const clearFilters = () => {
    setSelectedPriceRange(null);
    setSelectedPropertyType(null);
    setSearchQuery("");
    Alert.alert("Filters Cleared", "All filters have been reset");
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Explore</Text>
          <Text style={styles.subtitle}>Discover your perfect rental</Text>
        </View>
        <TouchableOpacity 
          style={styles.notificationButton}
          onPress={() => Alert.alert("Notifications", "Your notifications will appear here")}
        >
          <Ionicons name="notifications-outline" size={24} color="#003366" />
          <View style={styles.notificationDot} />
        </TouchableOpacity>
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
        {/* Search Section */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#666" />
            <TextInput
              style={styles.searchInput}
              placeholder="Search locations, properties, amenities..."
              placeholderTextColor="#999"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity onPress={handleSearch}>
              <Ionicons name="arrow-forward-circle" size={24} color="#0033A0" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            style={styles.advancedSearchButton}
            onPress={handleAdvancedSearch}
          >
            <Ionicons name="options-outline" size={16} color="#003366" />
            <Text style={styles.advancedSearchText}>Advanced Search</Text>
          </TouchableOpacity>
        </View>

        {/* Popular Searches */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Searches</Text>
            <Text style={styles.sectionSubtitle}>What others are looking for</Text>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.popularSearchesScroll}
            contentContainerStyle={styles.popularSearchesContent}
          >
            {popularSearches.map((search) => (
              <TouchableOpacity
                key={search.id}
                style={styles.searchChip}
                onPress={() => handlePopularSearch(search)}
              >
                <Text style={styles.searchTerm}>{search.term}</Text>
                <Text style={styles.searchCount}>{search.count}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Trending Locations */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Trending Locations</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.locationsScroll}
            contentContainerStyle={styles.locationsContent}
          >
            {trendingLocations.map((location) => (
              <TouchableOpacity
                key={location.id}
                style={styles.locationCard}
                onPress={() => handleLocationPress(location)}
              >
                <Image source={{ uri: location.image }} style={styles.locationImage} />
                <View style={styles.locationOverlay} />
                <View style={styles.locationInfo}>
                  <Text style={styles.locationName}>{location.name}</Text>
                  <Text style={styles.locationCity}>{location.city}</Text>
                  <View style={styles.locationStats}>
                    <Text style={styles.locationStat}>{location.properties} properties</Text>
                    <Text style={styles.locationStat}>Avg: Ksh {location.avgPrice}</Text>
                  </View>
                </View>
                <View style={styles.exploreBadge}>
                  <Ionicons name="compass" size={12} color="white" />
                  <Text style={styles.exploreBadgeText}>Explore</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Property Types */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Browse by Type</Text>
            <TouchableOpacity onPress={clearFilters}>
              <Text style={styles.clearFiltersText}>Clear Filters</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.propertyTypesGrid}>
            {propertyTypes.map((type) => (
              <TouchableOpacity
                key={type.id}
                style={[
                  styles.propertyTypeCard,
                  selectedPropertyType === type.id && styles.propertyTypeCardSelected
                ]}
                onPress={() => handlePropertyTypePress(type)}
              >
                <View style={[
                  styles.propertyTypeIcon,
                  selectedPropertyType === type.id && styles.propertyTypeIconSelected
                ]}>
                  <Ionicons 
                    name={type.icon as any} 
                    size={24} 
                    color={selectedPropertyType === type.id ? "white" : "#003366"} 
                  />
                </View>
                <Text style={styles.propertyTypeName}>{type.name}</Text>
                <Text style={styles.propertyTypeCount}>{type.count}</Text>
                <Text style={styles.propertyTypeDescription}>{type.description}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Price Ranges */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Price Range</Text>
            <Text style={styles.sectionSubtitle}>Filter by monthly rent</Text>
          </View>
          <View style={styles.priceRangesGrid}>
            {priceRanges.map((range) => (
              <TouchableOpacity
                key={range.id}
                style={[
                  styles.priceRangeChip,
                  selectedPriceRange === range.id && styles.priceRangeChipSelected
                ]}
                onPress={() => handlePriceRangePress(range)}
              >
                <Text style={[
                  styles.priceRangeText,
                  selectedPriceRange === range.id && styles.priceRangeTextSelected
                ]}>
                  {range.range}
                </Text>
                {selectedPriceRange === range.id && (
                  <Ionicons name="checkmark-circle" size={16} color="#2E8B57" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recently Viewed */}
        {recentlyViewed.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recently Viewed</Text>
              <TouchableOpacity>
                <Text style={styles.seeAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.recentlyViewedList}>
              {recentlyViewed.map((rental) => (
                <TouchableOpacity
                  key={rental.id}
                  style={styles.recentRentalCard}
                  onPress={() => handleRentalPress(rental)}
                >
                  <Image source={{ uri: rental.image }} style={styles.recentRentalImage} />
                  <View style={styles.recentRentalInfo}>
                    <Text style={styles.recentRentalName}>{rental.name}</Text>
                    <Text style={styles.recentRentalLocation}>{rental.location}</Text>
                    <Text style={styles.recentRentalPrice}>Ksh {rental.price}/month</Text>
                    <Text style={styles.recentRentalViewed}>{rental.viewed}</Text>
                  </View>
                  <TouchableOpacity style={styles.recentRentalAction}>
                    <Ionicons name="heart-outline" size={20} color="#666" />
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Quick Stats */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Ionicons name="trending-up" size={24} color="#0033A0" />
            <Text style={styles.statNumber}>1,458</Text>
            <Text style={styles.statLabel}>Active Listings</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="location" size={24} color="#2E8B57" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Cities</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#FF6B35" />
            <Text style={styles.statNumber}>15min</Text>
            <Text style={styles.statLabel}>Avg Response</Text>
          </View>
        </View>

        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "white",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
  },
  notificationButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
    position: "relative",
  },
  notificationDot: {
    position: "absolute",
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4444",
  },
  scrollView: {
    flex: 1,
  },
  searchSection: {
    padding: 20,
    backgroundColor: "white",
    marginBottom: 10,
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
    marginBottom: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: "#333",
  },
  advancedSearchButton: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0033A0",
    gap: 6,
  },
  advancedSearchText: {
    color: "#003366",
    fontSize: 14,
    fontWeight: "600",
  },
  section: {
    backgroundColor: "white",
    marginBottom: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginTop: 2,
  },
  seeAllText: {
    color: "#0033A0",
    fontWeight: "600",
    fontSize: 14,
  },
  clearFiltersText: {
    color: "#ff4444",
    fontWeight: "600",
    fontSize: 14,
  },
  popularSearchesScroll: {
    marginBottom: 5,
  },
  popularSearchesContent: {
    paddingHorizontal: 5,
  },
  searchChip: {
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#e9ecef",
    minWidth: 140,
  },
  searchTerm: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 2,
  },
  searchCount: {
    fontSize: 12,
    color: "#666",
  },
  locationsScroll: {
    marginBottom: 5,
  },
  locationsContent: {
    paddingHorizontal: 5,
  },
  locationCard: {
    width: 180,
    height: 120,
    borderRadius: 12,
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
  locationInfo: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
  },
  locationName: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    marginBottom: 2,
  },
  locationCity: {
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 4,
  },
  locationStats: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  locationStat: {
    fontSize: 10,
    color: "rgba(255,255,255,0.8)",
  },
  exploreBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,51,160,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  exploreBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "600",
  },
  propertyTypesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  propertyTypeCard: {
    width: (width - 54) / 2,
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "transparent",
  },
  propertyTypeCardSelected: {
    backgroundColor: "#f0f4ff",
    borderColor: "#0033A0",
  },
  propertyTypeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#e9ecef",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  propertyTypeIconSelected: {
    backgroundColor: "#0033A0",
  },
  propertyTypeName: {
    fontSize: 16,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 2,
  },
  propertyTypeCount: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  propertyTypeDescription: {
    fontSize: 12,
    color: "#666",
    lineHeight: 14,
  },
  priceRangesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  priceRangeChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
    gap: 8,
  },
  priceRangeChipSelected: {
    backgroundColor: "#f0f4ff",
    borderColor: "#0033A0",
  },
  priceRangeText: {
    fontSize: 14,
    color: "#003366",
    fontWeight: "500",
  },
  priceRangeTextSelected: {
    fontWeight: "600",
  },
  recentlyViewedList: {
    gap: 12,
  },
  recentRentalCard: {
    flexDirection: "row",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 12,
    alignItems: "center",
  },
  recentRentalImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  recentRentalInfo: {
    flex: 1,
  },
  recentRentalName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 2,
  },
  recentRentalLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 2,
  },
  recentRentalPrice: {
    fontSize: 14,
    fontWeight: "700",
    color: "#DAA520",
    marginBottom: 2,
  },
  recentRentalViewed: {
    fontSize: 12,
    color: "#999",
  },
  recentRentalAction: {
    padding: 8,
  },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "white",
    padding: 20,
    marginBottom: 10,
    gap: 12,
  },
  statCard: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 15,
    borderRadius: 12,
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  bottomSpacer: {
    height: 30,
  },
});