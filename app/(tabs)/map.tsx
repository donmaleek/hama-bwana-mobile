// app/(tabs)/map.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  Linking,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Platform-specific imports
let MapView: any = null;
let Marker: any = null;
let Callout: any = null;

if (Platform.OS !== 'web') {
  try {
    const maps = require("react-native-maps");
    MapView = maps.default;
    Marker = maps.Marker;
    Callout = maps.Callout;
  } catch (error) {
    console.warn("react-native-maps not available");
  }
}

const rentals = [
  {
    id: 1,
    title: "Modern 2 Bedroom Apartment",
    price: "35,000",
    location: "Kilimani, Nairobi",
    lat: -1.3000,
    lng: 36.7800,
    bedrooms: 2,
    bathrooms: 2,
    image: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg",
    rating: 4.8,
    reviews: 24,
    amenities: ["WiFi", "Parking", "Security"],
    distance: "1.2 km",
    featured: true,
    verified: true
  },
  {
    id: 2,
    title: "Luxury Studio Bedsitter",
    price: "18,000",
    location: "Westlands, Nairobi",
    lat: -1.2580,
    lng: 36.8000,
    bedrooms: 1,
    bathrooms: 1,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg",
    rating: 4.5,
    reviews: 18,
    amenities: ["WiFi", "Gym", "Pool"],
    distance: "2.5 km",
    featured: false,
    verified: true
  },
  {
    id: 3,
    title: "3 Bedroom Executive House",
    price: "120,000",
    location: "Karen, Nairobi",
    lat: -1.3190,
    lng: 36.7100,
    bedrooms: 3,
    bathrooms: 3,
    image: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg",
    rating: 4.9,
    reviews: 32,
    amenities: ["Garden", "Parking", "Security", "Pool"],
    distance: "5.8 km",
    featured: true,
    verified: true
  },
];

export default function MapScreen() {
  const [selectedRental, setSelectedRental] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation] = useState({
    latitude: -1.2921,
    longitude: 36.8219,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const mapRef = useRef<any>(null);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleRentalPress = (rental: any) => {
    setSelectedRental(rental);
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion({
        latitude: rental.lat,
        longitude: rental.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleViewDetails = (rental: any) => {
    router.push({
      pathname: "/rental-details",
      params: { rental: JSON.stringify(rental) }
    });
  };

  const handleViewOnMap = async (lat: number, lng: number) => {
    const url = `https://www.google.com/maps?q=${lat},${lng}`;
    
    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open maps application");
      }
    }
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'map' ? 'list' : 'map');
  };

  const filteredRentals = rentals.filter(rental => {
    return rental.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
           rental.location.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const focusOnUserLocation = () => {
    if (mapRef.current && Platform.OS !== 'web') {
      mapRef.current.animateToRegion(userLocation, 1000);
    }
  };

  const renderMapMarkers = () => {
    if (!MapView || Platform.OS === 'web') return null;

    return filteredRentals.map((rental) => (
      <Marker
        key={rental.id}
        coordinate={{
          latitude: rental.lat,
          longitude: rental.lng,
        }}
        onPress={() => handleRentalPress(rental)}
      >
        <Animated.View style={[
          styles.marker,
          selectedRental?.id === rental.id && styles.selectedMarker
        ]}>
          <Text style={styles.markerPrice}>Ksh {rental.price}</Text>
          {rental.featured && (
            <View style={styles.featuredBadge}>
              <Ionicons name="flash" size={8} color="white" />
            </View>
          )}
        </Animated.View>
        
        <Callout tooltip onPress={() => handleViewDetails(rental)}>
          <View style={styles.calloutContainer}>
            <Image source={{ uri: rental.image }} style={styles.calloutImage} />
            <View style={styles.calloutContent}>
              <View style={styles.calloutHeader}>
                <Text style={styles.calloutTitle} numberOfLines={1}>
                  {rental.title}
                </Text>
                {rental.verified && (
                  <Ionicons name="shield-checkmark" size={14} color="#2E8B57" />
                )}
              </View>
              <Text style={styles.calloutLocation}>{rental.location}</Text>
              <Text style={styles.calloutPrice}>Ksh {rental.price}/month</Text>
              <View style={styles.calloutDetails}>
                <View style={styles.detailItem}>
                  <Ionicons name="bed" size={12} color="#666" />
                  <Text style={styles.detailText}>{rental.bedrooms}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="water" size={12} color="#666" />
                  <Text style={styles.detailText}>{rental.bathrooms}</Text>
                </View>
                <View style={styles.detailItem}>
                  <Ionicons name="star" size={12} color="#FFD700" />
                  <Text style={styles.detailText}>{rental.rating}</Text>
                </View>
              </View>
              <TouchableOpacity 
                style={styles.calloutButton}
                onPress={() => handleViewDetails(rental)}
              >
                <Text style={styles.calloutButtonText}>View Details</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Callout>
      </Marker>
    ));
  };

  const renderRentalCard = (rental: any) => (
    <Animated.View 
      key={rental.id}
      style={[
        styles.rentalCard,
        {
          opacity: fadeAnim,
          transform: [{
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [50, 0]
            })
          }]
        }
      ]}
    >
      <TouchableOpacity onPress={() => handleViewDetails(rental)} style={styles.cardTouchable}>
        <View style={styles.cardHeader}>
          <Image source={{ uri: rental.image }} style={styles.rentalImage} />
          <View style={styles.cardBadges}>
            {rental.featured && (
              <View style={styles.featuredTag}>
                <Ionicons name="flash" size={12} color="white" />
                <Text style={styles.featuredText}>Featured</Text>
              </View>
            )}
            {rental.verified && (
              <View style={styles.verifiedTag}>
                <Ionicons name="shield-checkmark" size={12} color="white" />
                <Text style={styles.verifiedText}>Verified</Text>
              </View>
            )}
          </View>
        </View>
        
        <View style={styles.cardContent}>
          <View style={styles.rentalHeader}>
            <Text style={styles.rentalTitle} numberOfLines={1}>{rental.title}</Text>
            <Text style={styles.rentalPrice}>Ksh {rental.price}</Text>
          </View>
          
          <View style={styles.rentalLocationRow}>
            <Ionicons name="location" size={14} color="#666" />
            <Text style={styles.rentalLocation}>{rental.location}</Text>
            <Text style={styles.distance}>{rental.distance}</Text>
          </View>
          
          <View style={styles.rentalStats}>
            <View style={styles.statItem}>
              <Ionicons name="bed" size={14} color="#003366" />
              <Text style={styles.statText}>{rental.bedrooms} bed</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="water" size={14} color="#003366" />
              <Text style={styles.statText}>{rental.bathrooms} bath</Text>
            </View>
            <View style={styles.statItem}>
              <Ionicons name="star" size={14} color="#FFD700" />
              <Text style={styles.statText}>{rental.rating} ({rental.reviews})</Text>
            </View>
          </View>
          
          <View style={styles.amenities}>
            {rental.amenities.slice(0, 3).map((amenity: string, index: number) => (
              <View key={index} style={styles.amenityTag}>
                <Text style={styles.amenityText}>{amenity}</Text>
              </View>
            ))}
            {rental.amenities.length > 3 && (
              <Text style={styles.moreAmenities}>+{rental.amenities.length - 3} more</Text>
            )}
          </View>
        </View>
        
        <View style={styles.cardActions}>
          <TouchableOpacity 
            style={styles.detailsButton}
            onPress={() => handleViewDetails(rental)}
          >
            <Ionicons name="eye" size={16} color="#003366" />
            <Text style={styles.detailsButtonText}>View Details</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.mapButton}
            onPress={() => handleViewOnMap(rental.lat, rental.lng)}
          >
            <Ionicons name="navigate" size={16} color="#003366" />
            <Text style={styles.mapButtonText}>Directions</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );

  // Web fallback UI
  if (Platform.OS === 'web' || !MapView) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContent}>
            <Text style={styles.title}>Discover Rentals</Text>
            <Text style={styles.subtitle}>
              {filteredRentals.length} properties found in Nairobi
            </Text>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.viewToggle}
              onPress={toggleViewMode}
            >
              <Ionicons 
                name={viewMode === 'map' ? 'list' : 'map'} 
                size={20} 
                color="#003366" 
              />
              <Text style={styles.viewToggleText}>
                {viewMode === 'map' ? 'List' : 'Map'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#666" />
          <TextInput
            placeholder="Search locations or properties..."
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#999"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#666" />
            </TouchableOpacity>
          )}
        </View>

        {/* Web Map Notice */}
        <View style={styles.webMapNotice}>
          <View style={styles.webNoticeContent}>
            <Ionicons name="map" size={48} color="#003366" />
            <Text style={styles.webMessage}>Interactive Maps</Text>
            <Text style={styles.webSubtitle}>
              Experience full interactive maps with real-time property locations 
              in our mobile app. Download now for the complete Hama Bwana experience!
            </Text>
            <TouchableOpacity style={styles.downloadButton}>
              <Ionicons name="download" size={16} color="white" />
              <Text style={styles.downloadText}>Get Mobile App</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Properties Grid */}
        <ScrollView 
          style={styles.rentalsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.propertiesGrid}>
            {filteredRentals.map(renderRentalCard)}
          </View>
        </ScrollView>
      </View>
    );
  }

  // Native maps UI
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Text style={styles.title}>Rentals Map</Text>
          <Text style={styles.subtitle}>
            {filteredRentals.length} properties in your area
          </Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity 
            style={styles.viewToggle}
            onPress={toggleViewMode}
          >
            <Ionicons 
              name={viewMode === 'map' ? 'list' : 'map'} 
              size={20} 
              color="#003366" 
            />
            <Text style={styles.viewToggleText}>
              {viewMode === 'map' ? 'List' : 'Map'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#666" />
        <TextInput
          placeholder="Search locations or properties..."
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>

      {/* Map View */}
      {viewMode === 'map' && (
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={userLocation}
            showsUserLocation={true}
            showsMyLocationButton={false}
            showsCompass={true}
            showsScale={true}
          >
            {renderMapMarkers()}
          </MapView>

          {/* Map Controls */}
          <View style={styles.mapControls}>
            <TouchableOpacity 
              style={styles.mapControlButton}
              onPress={focusOnUserLocation}
            >
              <Ionicons name="navigate" size={20} color="#003366" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <ScrollView 
          style={styles.rentalsContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.propertiesGrid}>
            {filteredRentals.map(renderRentalCard)}
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 15,
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
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    })
  },
  headerContent: {
    marginBottom: 10,
  },
  headerActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#003366",
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
    marginTop: 4,
    fontWeight: '500',
  },
  viewToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 6,
  },
  viewToggleText: {
    color: '#003366',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
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
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    })
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#333',
  },
  webMapNotice: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 20,
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
      web: {
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
      }
    })
  },
  webNoticeContent: {
    alignItems: 'center',
  },
  webMessage: {
    fontSize: 20,
    fontWeight: '700',
    color: '#003366',
    marginTop: 12,
    marginBottom: 8,
  },
  webSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  downloadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#003366',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  downloadText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  mapContainer: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapControls: {
    position: 'absolute',
    top: 20,
    right: 20,
    gap: 12,
  },
  mapControlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
      }
    })
  },
  marker: {
    backgroundColor: '#003366',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'white',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 4,
      },
      web: {
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
      }
    })
  },
  selectedMarker: {
    backgroundColor: '#FF6B35',
    transform: [{ scale: 1.2 }],
  },
  markerPrice: {
    color: 'white',
    fontSize: 10,
    fontWeight: '700',
  },
  featuredBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF6B35',
    width: 12,
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calloutContainer: {
    width: 250,
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
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
      web: {
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
      }
    })
  },
  calloutImage: {
    width: '100%',
    height: 120,
  },
  calloutContent: {
    padding: 12,
  },
  calloutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  calloutTitle: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#003366',
    marginRight: 4,
  },
  calloutLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  calloutPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DAA520',
    marginBottom: 8,
  },
  calloutDetails: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  calloutButton: {
    backgroundColor: '#003366',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  calloutButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  rentalsContainer: {
    flex: 1,
  },
  propertiesGrid: {
    padding: 16,
    gap: 16,
  },
  rentalCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
      },
      android: {
        elevation: 8,
      },
      web: {
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
      }
    })
  },
  cardTouchable: {
    flex: 1,
  },
  cardHeader: {
    position: 'relative',
  },
  rentalImage: {
    width: '100%',
    height: 180,
  },
  cardBadges: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  featuredTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FF6B35',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  featuredText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2E8B57',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  verifiedText: {
    color: 'white',
    fontSize: 10,
    fontWeight: '600',
  },
  cardContent: {
    padding: 16,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rentalTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginRight: 12,
  },
  rentalPrice: {
    fontSize: 20,
    fontWeight: '800',
    color: '#DAA520',
  },
  rentalLocationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 6,
  },
  rentalLocation: {
    flex: 1,
    fontSize: 14,
    color: '#666',
  },
  distance: {
    fontSize: 12,
    color: '#999',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  rentalStats: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 14,
    color: '#003366',
    fontWeight: '500',
  },
  amenities: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  amenityTag: {
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  amenityText: {
    fontSize: 12,
    color: '#003366',
    fontWeight: '500',
  },
  moreAmenities: {
    fontSize: 12,
    color: '#666',
    fontStyle: 'italic',
  },
  cardActions: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
    gap: 12,
  },
  detailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    padding: 12,
    borderRadius: 12,
    gap: 8,
  },
  detailsButtonText: {
    color: '#003366',
    fontSize: 14,
    fontWeight: '600',
  },
  mapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f0f4ff',
    gap: 8,
  },
  mapButtonText: {
    color: '#003366',
    fontSize: 14,
    fontWeight: '600',
  },
});