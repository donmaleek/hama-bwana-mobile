// app/(tabs)/map.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from 'react';
import {
  Alert,
  Dimensions,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

// Platform-specific imports
let MapView: any = null;
let Marker: any = null;

if (Platform.OS !== 'web') {
  try {
    const maps = require("react-native-maps");
    MapView = maps.default;
    Marker = maps.Marker;
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
    image: "https://images.pexels.com/photos/259962/pexels-photo-259962.jpeg"
  },
  {
    id: 2,
    title: "Studio Bedsitter",
    price: "12,000",
    location: "Nakuru Town",
    lat: -0.3031,
    lng: 36.0800,
    bedrooms: 1,
    bathrooms: 1,
    image: "https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg"
  },
  {
    id: 3,
    title: "3 Bedroom Luxury House",
    price: "80,000",
    location: "Nyali, Mombasa",
    lat: -4.0500,
    lng: 39.7000,
    bedrooms: 3,
    bathrooms: 3,
    image: "https://images.pexels.com/photos/1571459/pexels-photo-1571459.jpeg"
  },
];

export default function MapScreen() {
  const handleRentalPress = (rental: any) => {
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

  const handleListView = () => {
    // For web, we're already showing the list view
    if (Platform.OS === 'web') {
      return;
    }
    Alert.alert("List View", "Switch to list view feature would be implemented here");
  };

  // Web fallback UI
  if (Platform.OS === 'web') {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Available Rentals</Text>
          <Text style={styles.subtitle}>Browse properties by location</Text>
        </View>
        
        <View style={styles.webMapFallback}>
          <View style={styles.webNotice}>
            <Ionicons name="map-outline" size={48} color="#003366" />
            <Text style={styles.webMessage}>Interactive Map</Text>
            <Text style={styles.webSubtitle}>
              Full interactive maps are available in the mobile app. 
              For now, explore our available rentals below.
            </Text>
          </View>
          
          <ScrollView style={styles.rentalsContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>All Available Rentals</Text>
            {rentals.map((rent) => (
              <TouchableOpacity
                key={rent.id}
                style={styles.rentalCard}
                onPress={() => handleRentalPress(rent)}
              >
                <View style={styles.rentalHeader}>
                  <Text style={styles.rentalTitle}>{rent.title}</Text>
                  <Text style={styles.rentalPrice}>Ksh {rent.price}</Text>
                </View>
                
                <Text style={styles.rentalLocation}>{rent.location}</Text>
                
                <View style={styles.rentalDetails}>
                  <View style={styles.detailItem}>
                    <Ionicons name="bed-outline" size={16} color="#003366" />
                    <Text style={styles.detailText}>{rent.bedrooms} bed</Text>
                  </View>
                  <View style={styles.detailItem}>
                    <Ionicons name="water-outline" size={16} color="#003366" />
                    <Text style={styles.detailText}>{rent.bathrooms} bath</Text>
                  </View>
                </View>
                
                <View style={styles.coordinates}>
                  <Ionicons name="location" size={14} color="#666" />
                  <Text style={styles.coordinateText}>
                    {rent.lat.toFixed(4)}, {rent.lng.toFixed(4)}
                  </Text>
                </View>
                
                <View style={styles.rentalActions}>
                  <TouchableOpacity 
                    style={styles.viewDetailsButton}
                    onPress={() => handleRentalPress(rent)}
                  >
                    <Ionicons name="eye-outline" size={16} color="#003366" />
                    <Text style={styles.viewDetailsText}>View Details</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.viewOnMapButton}
                    onPress={() => handleViewOnMap(rent.lat, rent.lng)}
                  >
                    <Ionicons name="map-outline" size={16} color="#0033A0" />
                    <Text style={styles.viewOnMapText}>View on Map</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Native maps UI - if MapView is not available
  if (!MapView) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Rentals Map</Text>
          <Text style={styles.subtitle}>Browse properties by location</Text>
        </View>
        
        <View style={styles.webMapFallback}>
          <View style={styles.webNotice}>
            <Ionicons name="alert-circle-outline" size={48} color="#ff6b35" />
            <Text style={styles.webMessage}>Maps Not Available</Text>
            <Text style={styles.webSubtitle}>
              Maps functionality is not available on this device. 
              Please check your app permissions or try updating.
            </Text>
          </View>
          
          <ScrollView style={styles.rentalsContainer} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionTitle}>Available Rentals</Text>
            {rentals.map((rent) => (
              <TouchableOpacity
                key={rent.id}
                style={styles.rentalCard}
                onPress={() => handleRentalPress(rent)}
              >
                <View style={styles.rentalHeader}>
                  <Text style={styles.rentalTitle}>{rent.title}</Text>
                  <Text style={styles.rentalPrice}>Ksh {rent.price}</Text>
                </View>
                <Text style={styles.rentalLocation}>{rent.location}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    );
  }

  // Native maps UI - with MapView available
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rentals Map</Text>
        <Text style={styles.subtitle}>Tap on markers to view property details</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: -0.0236,
          longitude: 37.9062,
          latitudeDelta: 8,
          longitudeDelta: 8,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
      >
        {rentals.map((rent) => (
          <Marker
            key={rent.id}
            coordinate={{
              latitude: rent.lat,
              longitude: rent.lng,
            }}
            title={rent.title}
            description={`Ksh ${rent.price} - ${rent.location}`}
            onPress={() => handleRentalPress(rent)}
          />
        ))}
      </MapView>

      <View style={styles.mapFooter}>
        <Text style={styles.footerText}>
          {rentals.length} properties found in your area
        </Text>
        <TouchableOpacity 
          style={styles.listViewButton}
          onPress={handleListView}
        >
          <Ionicons name="list" size={16} color="#0033A0" />
          <Text style={styles.listViewText}>List View</Text>
        </TouchableOpacity>
      </View>
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
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003366",
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: 'center',
    marginTop: 4,
  },
  map: {
    width: Dimensions.get("window").width,
    height: Dimensions.get("window").height - 180,
  },
  webMapFallback: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  webNotice: {
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  webMessage: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#003366',
    marginTop: 10,
    marginBottom: 8,
    textAlign: 'center',
  },
  webSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  rentalsContainer: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginBottom: 15,
  },
  rentalCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rentalTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#003366',
    flex: 1,
    marginRight: 10,
  },
  rentalPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DAA520',
  },
  rentalLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 12,
  },
  rentalDetails: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#003366',
    fontWeight: '500',
  },
  coordinates: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    padding: 8,
    borderRadius: 6,
    marginBottom: 12,
    gap: 6,
  },
  coordinateText: {
    fontSize: 12,
    color: '#003366',
    fontStyle: 'italic',
  },
  rentalActions: {
    flexDirection: 'row',
    gap: 10,
  },
  viewDetailsButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f4ff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0033A0',
    gap: 6,
  },
  viewDetailsText: {
    color: '#003366',
    fontSize: 14,
    fontWeight: '600',
  },
  viewOnMapButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#0033A0',
    gap: 6,
  },
  viewOnMapText: {
    color: '#0033A0',
    fontSize: 14,
    fontWeight: '600',
  },
  mapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  footerText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  listViewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    gap: 4,
  },
  listViewText: {
    color: '#0033A0',
    fontSize: 14,
    fontWeight: '600',
  },
});