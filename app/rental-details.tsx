// app/rental-details.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Modal,
  Share,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Define the rental type for better TypeScript support
interface Rental {
  id: number;
  title: string;
  price: string;
  location: string;
  description: string;
  image: string;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  size: string;
  amenities: string[];
  owner: {
    name: string;
    phone: string;
    email: string;
    rating: number;
    properties: number;
    verified: boolean;
    memberSince: string;
  };
  availableFrom: string;
  deposit: string;
  postedDate: string;
  propertyType: string;
  leaseTerm: string;
  petFriendly: boolean;
  furnished: boolean;
}

const defaultRental: Rental = {
  id: 1,
  title: "Modern 2 Bedroom Apartment with Stunning City Views",
  price: "Ksh 45,000 / month",
  location: "Kilimani, Nairobi",
  description: "A beautifully designed modern 2-bedroom apartment featuring spacious rooms, ample natural lighting, and 24/7 security. Located in the heart of Kilimani, this property offers easy access to shopping malls, restaurants, and major transportation routes. The apartment comes with modern finishes, fitted wardrobes, and a balcony with panoramic city views.",
  image: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800",
  images: [
    "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  bedrooms: 2,
  bathrooms: 2,
  size: "1200 sq ft",
  amenities: ["WiFi", "Parking", "Security", "Gym", "Swimming Pool", "Backup Generator", "Water Heater", "Balcony"],
  owner: {
    name: "John Kamau",
    phone: "+254712345678",
    email: "john.kamau@example.com",
    rating: 4.8,
    properties: 12,
    verified: true,
    memberSince: "2020"
  },
  availableFrom: "2024-02-01",
  deposit: "Ksh 90,000",
  postedDate: "2024-01-15",
  propertyType: "Apartment",
  leaseTerm: "1 year minimum",
  petFriendly: true,
  furnished: true
};

// Fallback image for error handling
const FALLBACK_IMAGE = "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800";

export default function RentalDetailsScreen() {
  const params = useLocalSearchParams();
  const rental: Rental = params.rental 
    ? JSON.parse(params.rental as string)
    : defaultRental;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');
  const [imageErrors, setImageErrors] = useState<{[key: number]: boolean}>({});
  
  const scrollY = useRef(new Animated.Value(0)).current;
  const imageScrollX = useRef(new Animated.Value(0)).current;

  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

  // Handle image loading errors
  const handleImageError = (index: number) => {
    setImageErrors(prev => ({ ...prev, [index]: true }));
  };

  // Get image source with fallback
  const getImageSource = (index: number) => {
    return imageErrors[index] 
      ? { uri: FALLBACK_IMAGE }
      : { uri: rental.images[index] };
  };

  const handleContactOwner = (method?: string) => {
    if (method === 'call') {
      Linking.openURL(`tel:${rental.owner.phone}`);
      return;
    }

    Alert.alert(
      "Contact Owner",
      `Choose how you'd like to contact ${rental.owner.name}`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "📞 Call", 
          onPress: () => Linking.openURL(`tel:${rental.owner.phone}`)
        },
        {
          text: "💬 WhatsApp",
          onPress: () => {
            const phone = rental.owner.phone.replace('+', '');
            const message = `Hello, I'm interested in your rental: ${rental.title} listed at ${rental.price}`;
            Linking.openURL(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`);
          }
        },
        {
          text: "📧 Email",
          onPress: () => Linking.openURL(`mailto:${rental.owner.email}?subject=Interest in ${rental.title}&body=Hello, I would like more information about this property.`)
        },
        {
          text: "📱 SMS",
          onPress: () => Linking.openURL(`sms:${rental.owner.phone}`)
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `🏠 Check out this amazing rental on Hama Bwana: ${rental.title} - ${rental.price} in ${rental.location}. ${rental.description.substring(0, 100)}...`,
        url: rental.images[0],
        title: rental.title
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share rental");
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // TODO: Update favorite status in backend
  };

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === rental.images.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? rental.images.length - 1 : prev - 1
    );
  };

  const openImageModal = () => {
    setModalVisible(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'overview':
        return (
          <View style={styles.sectionContent}>
            <Text style={styles.description}>{rental.description}</Text>
            
            <View style={styles.featuresGrid}>
              <View style={styles.featureItem}>
                <Ionicons name="business-outline" size={20} color="#003366" />
                <Text style={styles.featureText}>{rental.propertyType}</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name="calendar-outline" size={20} color="#003366" />
                <Text style={styles.featureText}>{rental.leaseTerm}</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name={rental.furnished ? "checkmark-circle" : "close-circle"} size={20} color={rental.furnished ? "#2e8b57" : "#ff4444"} />
                <Text style={styles.featureText}>{rental.furnished ? "Furnished" : "Unfurnished"}</Text>
              </View>
              <View style={styles.featureItem}>
                <Ionicons name={rental.petFriendly ? "paw" : "paw-outline"} size={20} color={rental.petFriendly ? "#2e8b57" : "#ff4444"} />
                <Text style={styles.featureText}>{rental.petFriendly ? "Pet Friendly" : "No Pets"}</Text>
              </View>
            </View>
          </View>
        );
      
      case 'amenities':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.amenitiesGrid}>
              {rental.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityCard}>
                  <Ionicons name="checkmark-circle" size={20} color="#2e8b57" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>
        );
      
      case 'location':
        return (
          <View style={styles.sectionContent}>
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <Ionicons name="location" size={24} color="#003366" />
                <Text style={styles.locationTitle}>Prime Location</Text>
              </View>
              <Text style={styles.locationDescription}>
                Located in the prestigious Kilimani area, this property offers easy access to:
              </Text>
              <View style={styles.nearbyList}>
                <Text style={styles.nearbyItem}>• Shopping malls & supermarkets</Text>
                <Text style={styles.nearbyItem}>• Restaurants & cafes</Text>
                <Text style={styles.nearbyItem}>• Schools & hospitals</Text>
                <Text style={styles.nearbyItem}>• Public transportation</Text>
                <Text style={styles.nearbyItem}>• Business districts</Text>
              </View>
            </View>
          </View>
        );
      
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="transparent" translucent />
      
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <TouchableOpacity style={styles.headerButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>{rental.title}</Text>
        <TouchableOpacity style={styles.headerButton} onPress={toggleFavorite}>
          <Ionicons 
            name={isFavorite ? "heart" : "heart-outline"} 
            size={22} 
            color={isFavorite ? "#ff4444" : "#003366"} 
          />
        </TouchableOpacity>
      </Animated.View>

      <Animated.ScrollView 
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Image Gallery with Horizontal Scroll */}
        <View style={styles.imageContainer}>
          <Animated.ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: imageScrollX } } }],
              { useNativeDriver: true }
            )}
            onMomentumScrollEnd={(event) => {
              const newIndex = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH
              );
              setCurrentImageIndex(newIndex);
            }}
            scrollEventThrottle={16}
          >
            {rental.images.map((image, index) => (
              <TouchableOpacity key={index} onPress={openImageModal} activeOpacity={0.9}>
                <Image 
                  source={getImageSource(index)} 
                  style={styles.mainImage} 
                  onError={() => handleImageError(index)}
                />
              </TouchableOpacity>
            ))}
          </Animated.ScrollView>

          {/* Image Counter */}
          <View style={styles.imageCounter}>
            <Text style={styles.imageCounterText}>
              {currentImageIndex + 1} / {rental.images.length}
            </Text>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={22} color="#003366" />
            </TouchableOpacity>
            
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={22} 
                  color={isFavorite ? "#ff4444" : "#003366"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={22} color="#003366" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Location */}
          <View style={styles.headerSection}>
            <View style={styles.titleRow}>
              <Text style={styles.title}>{rental.title}</Text>
              {rental.furnished && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Furnished</Text>
                </View>
              )}
            </View>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={18} color="#ff6b35" />
              <Text style={styles.location}>{rental.location}</Text>
            </View>
          </View>

          {/* Price & Quick Actions */}
          <View style={styles.priceSection}>
            <Text style={styles.price}>{rental.price}</Text>
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction} onPress={() => handleContactOwner('call')}>
                <Ionicons name="call" size={18} color="#003366" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.quickAction} onPress={toggleFavorite}>
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={18} 
                  color={isFavorite ? "#ff4444" : "#003366"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Ionicons name="bed" size={24} color="#003366" />
              <Text style={styles.statNumber}>{rental.bedrooms}</Text>
              <Text style={styles.statLabel}>Bedrooms</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="water" size={24} color="#003366" />
              <Text style={styles.statNumber}>{rental.bathrooms}</Text>
              <Text style={styles.statLabel}>Bathrooms</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Ionicons name="expand" size={24} color="#003366" />
              <Text style={styles.statNumber}>{rental.size}</Text>
              <Text style={styles.statLabel}>Size</Text>
            </View>
          </View>

          {/* Section Navigation */}
          <View style={styles.sectionNav}>
            <TouchableOpacity 
              style={[styles.navItem, activeSection === 'overview' && styles.navItemActive]}
              onPress={() => setActiveSection('overview')}
            >
              <Text style={[styles.navText, activeSection === 'overview' && styles.navTextActive]}>
                Overview
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.navItem, activeSection === 'amenities' && styles.navItemActive]}
              onPress={() => setActiveSection('amenities')}
            >
              <Text style={[styles.navText, activeSection === 'amenities' && styles.navTextActive]}>
                Amenities
              </Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.navItem, activeSection === 'location' && styles.navItemActive]}
              onPress={() => setActiveSection('location')}
            >
              <Text style={[styles.navText, activeSection === 'location' && styles.navTextActive]}>
                Location
              </Text>
            </TouchableOpacity>
          </View>

          {/* Dynamic Section Content */}
          {renderSectionContent()}

          {/* Owner Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Owner</Text>
            <View style={styles.ownerCard}>
              <View style={styles.ownerHeader}>
                <View style={styles.ownerAvatar}>
                  <Text style={styles.ownerInitial}>
                    {rental.owner.name.charAt(0)}
                  </Text>
                </View>
                <View style={styles.ownerInfo}>
                  <View style={styles.ownerNameRow}>
                    <Text style={styles.ownerName}>{rental.owner.name}</Text>
                    {rental.owner.verified && (
                      <Ionicons name="shield-checkmark" size={16} color="#2e8b57" />
                    )}
                  </View>
                  <View style={styles.ownerStats}>
                    <View style={styles.ratingContainer}>
                      <Ionicons name="star" size={14} color="#FFD700" />
                      <Text style={styles.ownerRating}>{rental.owner.rating}</Text>
                    </View>
                    <Text style={styles.ownerProperties}>• {rental.owner.properties} properties</Text>
                    <Text style={styles.memberSince}>• Member since {rental.owner.memberSince}</Text>
                  </View>
                </View>
              </View>
              <TouchableOpacity style={styles.messageButton} onPress={() => handleContactOwner()}>
                <Ionicons name="chatbubble-ellipses" size={18} color="white" />
                <Text style={styles.messageButtonText}>Message</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Details</Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailItem}>
                <Ionicons name="calendar" size={18} color="#666" />
                <Text style={styles.detailLabel}>Available From</Text>
                <Text style={styles.detailValue}>{formatDate(rental.availableFrom)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="shield" size={18} color="#666" />
                <Text style={styles.detailLabel}>Deposit</Text>
                <Text style={styles.detailValue}>{rental.deposit}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="time" size={18} color="#666" />
                <Text style={styles.detailLabel}>Posted</Text>
                <Text style={styles.detailValue}>{formatDate(rental.postedDate)}</Text>
              </View>
              <View style={styles.detailItem}>
                <Ionicons name="business" size={18} color="#666" />
                <Text style={styles.detailLabel}>Type</Text>
                <Text style={styles.detailValue}>{rental.propertyType}</Text>
              </View>
            </View>
          </View>

          {/* Safety Tips */}
          <View style={styles.safetyTips}>
            <Ionicons name="shield-checkmark" size={20} color="#2e8b57" />
            <Text style={styles.safetyText}>
              Always meet in public places for viewings. Never transfer money before signing a contract.
            </Text>
          </View>
        </View>
        
        {/* Extra spacing for footer */}
        <View style={{ height: 120 }} />
      </Animated.ScrollView>

      {/* Fixed Contact Button */}
      <View style={styles.footer}>
        <View style={styles.footerContent}>
          <View style={styles.priceFooter}>
            <Text style={styles.footerPrice}>{rental.price}</Text>
            <Text style={styles.footerLabel}>per month</Text>
          </View>
          <TouchableOpacity style={styles.contactButton} onPress={() => handleContactOwner()}>
            <Ionicons name="chatbubble-ellipses" size={20} color="white" />
            <Text style={styles.contactButtonText}>Contact Owner</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Enhanced Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalClose} 
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={28} color="white" />
          </TouchableOpacity>
          
          <View style={styles.modalHeader}>
            <Text style={styles.modalCounter}>
              {currentImageIndex + 1} of {rental.images.length}
            </Text>
          </View>
          
          <Image 
            source={getImageSource(currentImageIndex)} 
            style={styles.modalImage} 
            resizeMode="contain"
            onError={() => handleImageError(currentImageIndex)}
          />
          
          <View style={styles.modalFooter}>
            <Text style={styles.modalTitle}>{rental.title}</Text>
          </View>
        </View>
      </Modal>
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
    paddingHorizontal: 15,
    paddingTop: 40,
    zIndex: 1000,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    textAlign: 'center',
    marginHorizontal: 10,
  },
  imageContainer: {
    position: 'relative',
    height: 350,
  },
  mainImage: {
    width: SCREEN_WIDTH,
    height: 350,
  },
  imageCounter: {
    position: 'absolute',
    top: 50,
    right: 15,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  imageCounterText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    position: 'absolute',
    top: 45,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  iconButton: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  rightActions: {
    flexDirection: 'row',
    gap: 10,
  },
  content: {
    padding: 20,
  },
  headerSection: {
    marginBottom: 15,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 22,
    fontWeight: "700",
    color: "#003366",
    lineHeight: 28,
  },
  badge: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e8b57',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginLeft: 6,
    fontWeight: '500',
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    color: "#ff6b35",
  },
  quickActions: {
    flexDirection: 'row',
    gap: 10,
  },
  quickAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
    marginBottom: 25,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginTop: 8,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e0e0e0',
  },
  sectionNav: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  navItem: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  navItemActive: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  navText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  navTextActive: {
    color: '#003366',
    fontWeight: '600',
  },
  sectionContent: {
    marginBottom: 25,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#555",
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 15,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    flex: 1,
    minWidth: '45%',
  },
  featureText: {
    fontSize: 14,
    color: '#003366',
    marginLeft: 6,
    fontWeight: '500',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0033A0',
    flex: 1,
    minWidth: '45%',
  },
  amenityText: {
    fontSize: 14,
    color: '#003366',
    marginLeft: 8,
    fontWeight: '500',
  },
  locationCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#003366',
    marginLeft: 8,
  },
  locationDescription: {
    fontSize: 14,
    lineHeight: 20,
    color: '#666',
    marginBottom: 12,
  },
  nearbyList: {
    gap: 4,
  },
  nearbyItem: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 15,
  },
  ownerCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 16,
  },
  ownerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  ownerAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#003366',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  ownerInitial: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  ownerInfo: {
    flex: 1,
  },
  ownerNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    marginRight: 6,
  },
  ownerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerRating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
    fontWeight: '500',
  },
  ownerProperties: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  memberSince: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  messageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#003366",
    borderRadius: 12,
    padding: 16,
    gap: 8,
  },
  messageButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  detailsGrid: {
    gap: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    marginLeft: 12,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#003366',
    fontWeight: '600',
  },
  safetyTips: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f0f8f0',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  safetyText: {
    flex: 1,
    fontSize: 14,
    color: '#2e8b57',
    lineHeight: 20,
    fontWeight: '500',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingBottom: 10,
  },
  footerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  priceFooter: {
    flex: 1,
  },
  footerPrice: {
    fontSize: 20,
    fontWeight: '700',
    color: '#ff6b35',
  },
  footerLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#ff6b35",
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    flex: 1,
    marginLeft: 15,
    gap: 8,
    shadowColor: "#ff6b35",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  contactButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: 8,
  },
  modalHeader: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  modalCounter: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 15,
  },
  modalImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  modalFooter: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1,
  },
  modalTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});