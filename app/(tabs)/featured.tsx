// app/(tabs)/featured.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const sampleRentals = [
  {
    id: 1,
    name: "Modern 2 Bedroom Apartment",
    price: "35,000",
    location: "Nairobi, Kilimani",
    image: "https://images.pexels.com/photos/271743/pexels-photo-271743.jpeg",
    bedrooms: 2,
    bathrooms: 2,
    size: "1200 sq ft",
    rating: 4.8,
    reviews: 24,
    amenities: ["WiFi", "Parking", "Security"],
    isFeatured: true,
    availableFrom: "2024-02-01",
    description: "A beautiful modern apartment with stunning city views and premium amenities."
  },
  {
    id: 2,
    name: "Studio Bedsitter",
    price: "12,000",
    location: "Nakuru Town",
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    bedrooms: 1,
    bathrooms: 1,
    size: "600 sq ft",
    rating: 4.5,
    reviews: 18,
    amenities: ["WiFi", "Water Included"],
    isFeatured: true,
    availableFrom: "Immediately",
    description: "Cozy and affordable studio perfect for students and young professionals."
  },
  {
    id: 3,
    name: "3 Bedroom Luxury House",
    price: "80,000",
    location: "Mombasa Nyali",
    image: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg",
    bedrooms: 3,
    bathrooms: 3,
    size: "2000 sq ft",
    rating: 4.9,
    reviews: 32,
    amenities: ["Pool", "Gym", "Parking", "Security", "Garden"],
    isFeatured: true,
    availableFrom: "2024-02-15",
    description: "Luxurious beachfront property with premium amenities and stunning ocean views."
  },
  {
    id: 4,
    name: "1 Bedroom Cozy Apartment",
    price: "18,000",
    location: "Nairobi, Westlands",
    image: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
    bedrooms: 1,
    bathrooms: 1,
    size: "800 sq ft",
    rating: 4.6,
    reviews: 15,
    amenities: ["WiFi", "Security"],
    isFeatured: false,
    availableFrom: "Immediately",
    description: "Modern apartment in the heart of Westlands with easy access to amenities."
  },
];

export default function Featured() {
  const [rentals, setRentals] = useState(sampleRentals);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  // Filter to show only featured rentals
  const featuredRentals = rentals.filter(rental => rental.isFeatured);

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) 
        ? prev.filter(favId => favId !== id)
        : [...prev, id]
    );
    
    // Show feedback
    const rental = rentals.find(r => r.id === id);
    if (rental && !favorites.includes(id)) {
      Alert.alert("Added to Favorites", `"${rental.name}" added to your favorites`);
    }
  };

  const handleRentalPress = (rental: any) => {
    router.push({
      pathname: "/rental-details",
      params: { rental: JSON.stringify(rental) }
    });
  };

  const handleContactOwner = (rental: any) => {
    Alert.alert(
      "Contact Owner",
      `Interested in "${rental.name}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Call Agent", 
          onPress: () => Alert.alert("Call", `Calling agent for ${rental.name}`)
        },
        {
          text: "Send Message",
          onPress: () => Alert.alert("Message", `Messaging agent for ${rental.name}`)
        },
        {
          text: "View Details",
          onPress: () => handleRentalPress(rental)
        }
      ]
    );
  };

  const refreshRentals = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
      Alert.alert("Refreshed", "Latest featured properties loaded!");
    }, 1500);
  };

  const formatPrice = (price: string) => {
    return `Ksh ${parseInt(price).toLocaleString()}/month`;
  };

  const getPriceColor = (price: string) => {
    const priceNum = parseInt(price);
    if (priceNum < 20000) return "#2E8B57"; // Green for affordable
    if (priceNum < 50000) return "#DAA520"; // Gold for medium
    return "#FF6B35"; // Orange for premium
  };

  const getAffordabilityLabel = (price: string) => {
    const priceNum = parseInt(price);
    if (priceNum < 20000) return "Budget Friendly";
    if (priceNum < 50000) return "Great Value";
    return "Premium";
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Featured Rentals</Text>
          <Text style={styles.subtitle}>Premium hand-picked properties</Text>
        </View>
        <TouchableOpacity 
          style={styles.filterButton}
          onPress={() => Alert.alert("Filter", "Filter options coming soon!")}
        >
          <Ionicons name="filter" size={20} color="#003366" />
        </TouchableOpacity>
      </View>

      {/* Stats Bar */}
      <View style={styles.statsBar}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{featuredRentals.length}</Text>
          <Text style={styles.statLabel}>Premium Listings</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            Ksh {Math.min(...featuredRentals.map(r => parseInt(r.price))).toLocaleString()}
          </Text>
          <Text style={styles.statLabel}>Starting From</Text>
        </View>
        <View style={styles.statDivider} />
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>
            {Math.max(...featuredRentals.map(r => r.rating))}
          </Text>
          <Text style={styles.statLabel}>Top Rated</Text>
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing} 
            onRefresh={refreshRentals}
            colors={["#0033A0"]}
            tintColor="#0033A0"
          />
        }
      >
        {/* Search Bar */}
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => Alert.alert("Search", "Search featured rentals coming soon!")}
        >
          <Ionicons name="search" size={20} color="#666" />
          <Text style={styles.searchText}>Search featured rentals...</Text>
          <Ionicons name="sparkles" size={16} color="#0033A0" />
        </TouchableOpacity>

        {/* Premium Badge */}
        <View style={styles.premiumBadge}>
          <Ionicons name="diamond" size={16} color="#DAA520" />
          <Text style={styles.premiumText}>PREMIUM SELECTION</Text>
        </View>

        {/* Featured Rentals */}
        <Text style={styles.sectionTitle}>Exclusive Properties</Text>
        <Text style={styles.sectionSubtitle}>
          Hand-picked quality properties with premium amenities
        </Text>

        {featuredRentals.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="home-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateTitle}>No Featured Properties</Text>
            <Text style={styles.emptyStateText}>
              Check back later for new premium listings
            </Text>
          </View>
        ) : (
          featuredRentals.map((rental) => (
            <TouchableOpacity
              key={rental.id}
              style={styles.card}
              onPress={() => handleRentalPress(rental)}
              activeOpacity={0.9}
            >
              {/* Image with Badges */}
              <View style={styles.imageContainer}>
                <Image source={{ uri: rental.image }} style={styles.image} />
                
                {/* Featured Badge */}
                <View style={styles.featuredBadge}>
                  <Ionicons name="star" size={12} color="white" />
                  <Text style={styles.featuredText}>FEATURED</Text>
                </View>

                {/* Affordability Badge */}
                <View style={styles.affordabilityBadge}>
                  <Text style={styles.affordabilityText}>
                    {getAffordabilityLabel(rental.price)}
                  </Text>
                </View>

                {/* Favorite Button */}
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(rental.id)}
                >
                  <Ionicons 
                    name={favorites.includes(rental.id) ? "heart" : "heart-outline"} 
                    size={24} 
                    color={favorites.includes(rental.id) ? "#ff4444" : "white"} 
                  />
                </TouchableOpacity>

                {/* Quick Info Overlay */}
                <View style={styles.imageOverlay}>
                  <View style={styles.quickInfo}>
                    <View style={styles.quickInfoItem}>
                      <Ionicons name="bed-outline" size={14} color="white" />
                      <Text style={styles.quickInfoText}>{rental.bedrooms}</Text>
                    </View>
                    <View style={styles.quickInfoItem}>
                      <Ionicons name="water-outline" size={14} color="white" />
                      <Text style={styles.quickInfoText}>{rental.bathrooms}</Text>
                    </View>
                    <View style={styles.quickInfoItem}>
                      <Ionicons name="resize-outline" size={14} color="white" />
                      <Text style={styles.quickInfoText}>{rental.size}</Text>
                    </View>
                  </View>
                </View>
              </View>

              {/* Rental Info */}
              <View style={styles.info}>
                <View style={styles.infoHeader}>
                  <Text style={styles.name} numberOfLines={2}>{rental.name}</Text>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={16} color="#FFD700" />
                    <Text style={styles.rating}>{rental.rating}</Text>
                    <Text style={styles.reviews}>({rental.reviews})</Text>
                  </View>
                </View>

                <View style={styles.locationContainer}>
                  <Ionicons name="location-outline" size={14} color="#666" />
                  <Text style={styles.location}>{rental.location}</Text>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                  {rental.description}
                </Text>

                <View style={styles.priceContainer}>
                  <View>
                    <Text style={[styles.price, { color: getPriceColor(rental.price) }]}>
                      {formatPrice(rental.price)}
                    </Text>
                    <Text style={styles.availableFrom}>Available {rental.availableFrom}</Text>
                  </View>
                  <View style={styles.priceTag}>
                    <Text style={styles.priceTagText}>
                      {getAffordabilityLabel(rental.price)}
                    </Text>
                  </View>
                </View>

                {/* Amenities */}
                <View style={styles.amenitiesContainer}>
                  {rental.amenities.slice(0, 3).map((amenity, index) => (
                    <View key={index} style={styles.amenityTag}>
                      <Ionicons name="checkmark" size={12} color="#2E8B57" />
                      <Text style={styles.amenityText}>{amenity}</Text>
                    </View>
                  ))}
                  {rental.amenities.length > 3 && (
                    <Text style={styles.moreAmenities}>
                      +{rental.amenities.length - 3} more
                    </Text>
                  )}
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity 
                    style={styles.contactButton}
                    onPress={() => handleContactOwner(rental)}
                  >
                    <Ionicons name="chatbubble-outline" size={16} color="#003366" />
                    <Text style={styles.contactButtonText}>Contact</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.detailsButton}
                    onPress={() => handleRentalPress(rental)}
                  >
                    <Ionicons name="eye-outline" size={16} color="white" />
                    <Text style={styles.detailsButtonText}>View Details</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}

        {/* Load More */}
        <TouchableOpacity 
          style={styles.loadMoreButton}
          onPress={() => Alert.alert("Load More", "More featured properties coming soon!")}
        >
          <Ionicons name="add-circle-outline" size={20} color="#0033A0" />
          <Text style={styles.loadMoreText}>Load More Properties</Text>
        </TouchableOpacity>

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
    paddingBottom: 15,
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
    fontSize: 24,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
  },
  filterButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
    marginTop: 4,
  },
  statsBar: {
    flexDirection: "row",
    backgroundColor: "white",
    paddingVertical: 20,
    paddingHorizontal: 20,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statNumber: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
  },
  statDivider: {
    width: 1,
    backgroundColor: "#e9ecef",
    marginHorizontal: 10,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 15,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchText: {
    flex: 1,
    marginLeft: 10,
    color: "#666",
    fontSize: 16,
  },
  premiumBadge: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    backgroundColor: "#fff8e1",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#FFD700",
    marginBottom: 20,
  },
  premiumText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#DAA520",
    marginLeft: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 5,
    textAlign: "center",
  },
  sectionSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
    lineHeight: 20,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  image: {
    width: "100%",
    height: 220,
  },
  featuredBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#0033A0",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  featuredText: {
    color: "white",
    fontSize: 10,
    fontWeight: "700",
    marginLeft: 4,
  },
  affordabilityBadge: {
    position: 'absolute',
    top: 12,
    right: 50,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  affordabilityText: {
    fontSize: 10,
    fontWeight: "700",
    color: "#003366",
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(0,0,0,0.3)',
    borderRadius: 20,
    padding: 6,
  },
  imageOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 8,
  },
  quickInfo: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  quickInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  quickInfoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  info: {
    padding: 16,
  },
  infoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    flex: 1,
    marginRight: 10,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    marginLeft: 4,
  },
  reviews: {
    fontSize: 12,
    color: "#666",
    marginLeft: 2,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    lineHeight: 18,
    marginBottom: 12,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  price: {
    fontSize: 20,
    fontWeight: "700",
  },
  availableFrom: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  priceTag: {
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#0033A0",
  },
  priceTagText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#003366",
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 15,
    gap: 8,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: "#f0f4ff",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0033A0",
    gap: 4,
  },
  amenityText: {
    fontSize: 12,
    color: "#003366",
    fontWeight: '500',
  },
  moreAmenities: {
    fontSize: 12,
    color: "#666",
    fontStyle: 'italic',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  contactButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#0033A0",
    gap: 6,
  },
  contactButtonText: {
    color: "#003366",
    fontWeight: "600",
    fontSize: 14,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#0033A0",
    padding: 12,
    borderRadius: 8,
    gap: 6,
  },
  detailsButtonText: {
    color: "white",
    fontWeight: "600",
    fontSize: 14,
  },
  loadMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#0033A0",
    marginTop: 10,
    gap: 8,
  },
  loadMoreText: {
    color: "#0033A0",
    fontWeight: "600",
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: 'white',
    borderRadius: 16,
    marginVertical: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
    lineHeight: 20,
  },
  bottomSpacer: {
    height: 30,
  },
});