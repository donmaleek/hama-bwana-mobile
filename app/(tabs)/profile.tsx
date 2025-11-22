// app/(tabs)/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Engineer Mathias Kasiba",
    description: "Property owner and real estate agent.",
    profilePic: require("../assets/profile.png"),
    email: "mathias@example.com",
    phone: "+254 712 345 678",
    joinedDate: "January 2024",
    userType: "landlord" // 'landlord' or 'tenant'
  });

  const [rentals, setRentals] = useState([
    {
      id: 1,
      title: "2 Bedroom Apartment",
      price: "Ksh 25,000",
      image: require("../assets/house1.jpeg"),
      location: "Nairobi West",
      status: "Occupied",
      tenants: 2,
      rating: 4.8
    },
    {
      id: 2,
      title: "Studio Bedsitter",
      price: "Ksh 12,000",
      image: require("../assets/house2.jpg"),
      location: "South B",
      status: "Available",
      tenants: 0,
      rating: 4.5
    },
  ]);

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Logout", 
          style: "destructive",
          onPress: () => router.replace("/(auth)/login")
        }
      ]
    );
  };

  const handleRentalPress = (rental: any) => {
    router.push({
      pathname: "/rental-details",
      params: { rental: JSON.stringify(rental) }
    });
  };

  const handleEditProfile = () => {
    Alert.alert("Edit Profile", "Profile editing feature coming soon!");
  };

  const stats = [
    { 
      label: "Total Properties", 
      value: rentals.length,
      icon: "business"
    },
    { 
      label: "Occupied", 
      value: rentals.filter(r => r.status === "Occupied").length,
      icon: "checkmark-circle"
    },
    { 
      label: "Available", 
      value: rentals.filter(r => r.status === "Available").length,
      icon: "home"
    },
    {
      label: "Avg Rating",
      value: (rentals.reduce((acc, curr) => acc + curr.rating, 0) / rentals.length).toFixed(1),
      icon: "star"
    }
  ];

  const quickActions = [
    {
      title: "Publish New",
      icon: "add-circle",
      onPress: () => router.push("/publish"),
      color: "#0033A0"
    },
    {
      title: "Manage Properties",
      icon: "settings",
      onPress: () => Alert.alert("Manage Properties", "Property management feature coming soon!"),
      color: "#2E8B57"
    },
    {
      title: "Messages",
      icon: "chatbubbles",
      onPress: () => Alert.alert("Messages", "Messages feature coming soon!"),
      color: "#FF6B35"
    },
    {
      title: "Favorites",
      icon: "heart",
      onPress: () => Alert.alert("Favorites", "Favorites feature coming soon!"),
      color: "#DAA520"
    }
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileImageContainer}>
          <Image source={user.profilePic} style={styles.profilePic} />
          <TouchableOpacity 
            style={styles.editProfileButton}
            onPress={handleEditProfile}
          >
            <Ionicons name="camera" size={16} color="white" />
          </TouchableOpacity>
        </View>
        
        <View style={styles.userInfo}>
          <Text style={styles.name}>{user.name}</Text>
          <Text style={styles.description}>{user.description}</Text>
          
          <View style={styles.userTypeBadge}>
            <Ionicons 
              name={user.userType === "landlord" ? "business" : "person"} 
              size={14} 
              color="#003366" 
            />
            <Text style={styles.userTypeText}>
              {user.userType === "landlord" ? "Property Owner" : "Tenant"}
            </Text>
          </View>
        </View>
      </View>

      {/* Contact Info */}
      <View style={styles.contactSection}>
        <View style={styles.contactItem}>
          <Ionicons name="mail" size={16} color="#666" />
          <Text style={styles.contactText}>{user.email}</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="call" size={16} color="#666" />
          <Text style={styles.contactText}>{user.phone}</Text>
        </View>
        <View style={styles.contactItem}>
          <Ionicons name="calendar" size={16} color="#666" />
          <Text style={styles.joinDate}>Member since {user.joinedDate}</Text>
        </View>
      </View>

      {/* Stats Section */}
      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <View style={styles.statIcon}>
              <Ionicons name={stat.icon as any} size={20} color="#003366" />
            </View>
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
              <Ionicons name={action.icon as any} size={20} color="white" />
            </View>
            <Text style={styles.actionText}>{action.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Your Rentals Section */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Rentals</Text>
        <TouchableOpacity>
          <Text style={styles.seeAllText}>See All</Text>
        </TouchableOpacity>
      </View>

      {rentals.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="home-outline" size={48} color="#ccc" />
          <Text style={styles.emptyStateText}>No rentals published yet</Text>
          <Text style={styles.emptyStateSubtext}>
            Start by publishing your first rental property
          </Text>
          <TouchableOpacity 
            style={styles.emptyStateButton}
            onPress={() => router.push("/publish")}
          >
            <Text style={styles.emptyStateButtonText}>Publish First Rental</Text>
          </TouchableOpacity>
        </View>
      ) : (
        rentals.map((rent) => (
          <TouchableOpacity 
            key={rent.id} 
            style={styles.rentalCard}
            onPress={() => handleRentalPress(rent)}
          >
            <Image source={rent.image} style={styles.rentalImage} />
            <View style={styles.rentalInfo}>
              <View style={styles.rentalHeader}>
                <Text style={styles.rentalTitle}>{rent.title}</Text>
                <View style={styles.ratingContainer}>
                  <Ionicons name="star" size={14} color="#FFD700" />
                  <Text style={styles.rating}>{rent.rating}</Text>
                </View>
              </View>
              <Text style={styles.rentalLocation}>{rent.location}</Text>
              <Text style={styles.rentalPrice}>{rent.price}</Text>
              <View style={styles.rentalMeta}>
                <View style={[
                  styles.statusBadge, 
                  rent.status === 'Available' ? styles.availableBadge : styles.occupiedBadge
                ]}>
                  <Text style={styles.statusText}>{rent.status}</Text>
                </View>
                <Text style={styles.tenantInfo}>
                  {rent.tenants} {rent.tenants === 1 ? 'tenant' : 'tenants'}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        ))
      )}

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.publishButton}
          onPress={() => router.push("/publish")}
        >
          <Ionicons name="add" size={20} color="white" />
          <Text style={styles.publishText}>Publish New Rental</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    backgroundColor: "#ffffff",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  profileImageContainer: {
    position: 'relative',
    alignSelf: 'center',
    marginBottom: 15,
  },
  profilePic: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#0033A0",
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 5,
    right: 5,
    backgroundColor: '#0033A0',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  userInfo: {
    alignItems: 'center',
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#003366",
    textAlign: 'center',
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 8,
  },
  userTypeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f4ff',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#0033A0',
  },
  userTypeText: {
    fontSize: 12,
    color: "#003366",
    fontWeight: '600',
    marginLeft: 4,
  },
  contactSection: {
    backgroundColor: '#ffffff',
    margin: 20,
    marginTop: 0,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  joinDate: {
    fontSize: 12,
    color: "#999",
    marginLeft: 8,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 14,
    color: "#0033A0",
    fontWeight: '600',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  actionCard: {
    width: '47%',
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    margin: 6,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#003366',
    textAlign: 'center',
  },
  rentalCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  rentalImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  rentalInfo: {
    flex: 1,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  rentalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: '#003366',
    flex: 1,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
  rentalLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  rentalPrice: {
    fontSize: 16,
    color: "#DAA520",
    fontWeight: '700',
    marginBottom: 6,
  },
  rentalMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e8b57',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2e8b57',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#d32f2f',
  },
  tenantInfo: {
    fontSize: 12,
    color: '#666',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#ffffff',
    marginHorizontal: 20,
    borderRadius: 12,
    marginBottom: 20,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 10,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    backgroundColor: "#0033A0",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyStateButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
  },
  actionButtons: {
    padding: 20,
    gap: 12,
  },
  publishButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#0033A0",
    padding: 16,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  publishText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: "#ff4444",
    padding: 14,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  bottomSpacer: {
    height: 20,
  },
});