// app/rental-details.tsx
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

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
  };
  availableFrom: string;
  deposit: string;
  postedDate: string;
}

const defaultRental: Rental = {
  id: 1,
  title: "Modern 2 Bedroom Apartment",
  price: "Ksh 45,000 / month",
  location: "Kilimani, Nairobi",
  description: "A beautiful modern 2-bedroom apartment with spacious rooms, natural lighting, and 24/7 security. Close to malls and main road.",
  image: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800",
  images: [
    "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
    "https://images.pexels.com/photos/271619/pexels-photo-271619.jpeg?auto=compress&cs=tinysrgb&w=800"
  ],
  bedrooms: 2,
  bathrooms: 2,
  size: "1200 sq ft",
  amenities: ["WiFi", "Parking", "Security", "Gym", "Swimming Pool"],
  owner: {
    name: "John Kamau",
    phone: "+254712345678",
    email: "john.kamau@example.com",
    rating: 4.8,
    properties: 12
  },
  availableFrom: "2024-02-01",
  deposit: "Ksh 90,000",
  postedDate: "2024-01-15"
};

export default function RentalDetailsScreen() {
  // Use Expo Router's useLocalSearchParams instead of route.params
  const params = useLocalSearchParams();
  
  // Parse the rental data from params or use default
  const rental: Rental = params.rental 
    ? JSON.parse(params.rental as string)
    : defaultRental;

  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const handleContactOwner = () => {
    Alert.alert(
      "Contact Owner",
      `Contact ${rental.owner.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Call", 
          onPress: () => Linking.openURL(`tel:${rental.owner.phone}`)
        },
        {
          text: "WhatsApp",
          onPress: () => {
            const phone = rental.owner.phone.replace('+', '');
            Linking.openURL(`https://wa.me/${phone}?text=Hello, I'm interested in your rental: ${rental.title}`);
          }
        },
        {
          text: "Email",
          onPress: () => Linking.openURL(`mailto:${rental.owner.email}?subject=Interest in ${rental.title}`)
        }
      ]
    );
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this rental on Hama Bwana: ${rental.title} - ${rental.price} in ${rental.location}. ${rental.description}`,
        url: rental.images[0],
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

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Image Gallery */}
        <View style={styles.imageContainer}>
          <TouchableOpacity onPress={openImageModal}>
            <Image 
              source={{ uri: rental.images[currentImageIndex] }} 
              style={styles.mainImage} 
            />
          </TouchableOpacity>
          
          {/* Image Navigation */}
          {rental.images.length > 1 && (
            <View style={styles.imageNavigation}>
              <TouchableOpacity style={styles.navButton} onPress={prevImage}>
                <Ionicons name="chevron-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.navButton} onPress={nextImage}>
                <Ionicons name="chevron-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>
          )}

          {/* Image Indicators */}
          <View style={styles.imageIndicators}>
            {rental.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.indicator,
                  index === currentImageIndex && styles.activeIndicator
                ]}
              />
            ))}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.iconButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#003366" />
            </TouchableOpacity>
            
            <View style={styles.rightActions}>
              <TouchableOpacity style={styles.iconButton} onPress={toggleFavorite}>
                <Ionicons 
                  name={isFavorite ? "heart" : "heart-outline"} 
                  size={24} 
                  color={isFavorite ? "#ff4444" : "#003366"} 
                />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
                <Ionicons name="share-social-outline" size={24} color="#003366" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title & Location */}
          <View style={styles.headerSection}>
            <Text style={styles.title}>{rental.title}</Text>
            <View style={styles.locationContainer}>
              <Ionicons name="location-outline" size={16} color="#666" />
              <Text style={styles.location}>{rental.location}</Text>
            </View>
          </View>

          {/* Price */}
          <Text style={styles.price}>{rental.price}</Text>

          {/* Quick Stats */}
          <View style={styles.statsContainer}>
            <View style={styles.stat}>
              <Ionicons name="bed-outline" size={20} color="#003366" />
              <Text style={styles.statText}>{rental.bedrooms} Bed</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="water-outline" size={20} color="#003366" />
              <Text style={styles.statText}>{rental.bathrooms} Bath</Text>
            </View>
            <View style={styles.stat}>
              <Ionicons name="resize-outline" size={20} color="#003366" />
              <Text style={styles.statText}>{rental.size}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{rental.description}</Text>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Amenities</Text>
            <View style={styles.amenitiesContainer}>
              {rental.amenities.map((amenity, index) => (
                <View key={index} style={styles.amenityTag}>
                  <Ionicons name="checkmark-circle" size={16} color="#2e8b57" />
                  <Text style={styles.amenityText}>{amenity}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Owner Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Property Owner</Text>
            <View style={styles.ownerContainer}>
              <View style={styles.ownerInfo}>
                <Text style={styles.ownerName}>{rental.owner.name}</Text>
                <View style={styles.ownerStats}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFD700" />
                    <Text style={styles.ownerRating}>{rental.owner.rating}</Text>
                  </View>
                  <Text style={styles.ownerProperties}>{rental.owner.properties} properties</Text>
                </View>
              </View>
              <TouchableOpacity style={styles.messageButton} onPress={handleContactOwner}>
                <Ionicons name="chatbubble-outline" size={20} color="#003366" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Additional Info */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <View style={styles.infoGrid}>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Available From</Text>
                <Text style={styles.infoValue}>{rental.availableFrom}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Security Deposit</Text>
                <Text style={styles.infoValue}>{rental.deposit}</Text>
              </View>
              <View style={styles.infoItem}>
                <Text style={styles.infoLabel}>Posted</Text>
                <Text style={styles.infoValue}>{rental.postedDate}</Text>
              </View>
            </View>
          </View>
        </View>
        
        {/* Extra spacing for footer */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Fixed Contact Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.contactButton} onPress={handleContactOwner}>
          <Ionicons name="call-outline" size={20} color="white" />
          <Text style={styles.contactButtonText}>Contact Owner</Text>
        </TouchableOpacity>
      </View>

      {/* Image Modal */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalClose} 
            onPress={() => setModalVisible(false)}
          >
            <Ionicons name="close" size={30} color="white" />
          </TouchableOpacity>
          
          {/* Modal Image Navigation */}
          {rental.images.length > 1 && (
            <View style={styles.modalNavigation}>
              <TouchableOpacity style={styles.modalNavButton} onPress={prevImage}>
                <Ionicons name="chevron-back" size={30} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalNavButton} onPress={nextImage}>
                <Ionicons name="chevron-forward" size={30} color="white" />
              </TouchableOpacity>
            </View>
          )}
          
          <Image 
            source={{ uri: rental.images[currentImageIndex] }} 
            style={styles.modalImage} 
            resizeMode="contain"
          />
          
          {/* Modal Indicators */}
          <View style={styles.modalIndicators}>
            {rental.images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.modalIndicator,
                  index === currentImageIndex && styles.modalActiveIndicator
                ]}
              />
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  imageContainer: {
    position: 'relative',
  },
  mainImage: {
    width: "100%",
    height: 300,
  },
  imageNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  navButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 25,
    padding: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageIndicators: {
    position: 'absolute',
    bottom: 15,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 4,
  },
  activeIndicator: {
    backgroundColor: 'white',
    width: 20,
  },
  actionButtons: {
    position: 'absolute',
    top: 50,
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
    padding: 8,
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
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  location: {
    fontSize: 16,
    color: "#666",
    marginLeft: 5,
  },
  price: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#DAA520",
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  stat: {
    alignItems: 'center',
  },
  statText: {
    fontSize: 14,
    color: '#003366',
    marginTop: 5,
    fontWeight: '500',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#003366",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 22,
    color: "#555",
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  amenityTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  amenityText: {
    fontSize: 14,
    color: '#003366',
    marginLeft: 5,
    fontWeight: '500',
  },
  ownerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f8f9fa',
    padding: 15,
    borderRadius: 10,
  },
  ownerInfo: {
    flex: 1,
  },
  ownerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 5,
  },
  ownerStats: {
    flexDirection: 'row',
    gap: 15,
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ownerRating: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  ownerProperties: {
    fontSize: 14,
    color: '#666',
  },
  messageButton: {
    padding: 10,
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  infoGrid: {
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#003366',
    fontWeight: '600',
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#0033A0",
    borderRadius: 10,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contactButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 8,
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
    padding: 5,
  },
  modalNavigation: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    zIndex: 1,
  },
  modalNavButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 30,
    padding: 15,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalImage: {
    width: '100%',
    height: '70%',
  },
  modalIndicators: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255,255,255,0.5)',
    marginHorizontal: 5,
  },
  modalActiveIndicator: {
    backgroundColor: 'white',
    width: 25,
  },
});