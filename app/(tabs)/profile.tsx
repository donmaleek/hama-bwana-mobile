// app/(tabs)/profile.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Alert,
  Animated,
  Dimensions,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function Profile() {
  const [user, setUser] = useState({
    name: "Engineer Mathias Kasiba",
    description: "Premium Property Owner & Real Estate Consultant",
    profilePic: require("../assets/profile.png"),
    email: "mathias@hama-bwana.com",
    phone: "+254 712 345 678",
    joinedDate: "January 2024",
    userType: "landlord", // 'landlord' or 'tenant'
    verified: true,
    responseRate: 98,
    avgResponseTime: "15 min"
  });

  const [activeTab, setActiveTab] = useState('properties'); // 'properties', 'analytics', 'settings'
  const [rentals, setRentals] = useState([
    {
      id: 1,
      title: "Luxury 2 Bedroom Apartment",
      price: "Ksh 45,000",
      image: require("../assets/house1.jpeg"),
      location: "Kilimani, Nairobi",
      status: "Occupied",
      tenants: 2,
      rating: 4.8,
      views: 1247,
      inquiries: 23,
      booked: "2024-01-15",
      type: "apartment",
      earnings: "Ksh 90,000"
    },
    {
      id: 2,
      title: "Modern Studio Bedsitter",
      price: "Ksh 18,000",
      image: require("../assets/house2.jpg"),
      location: "South B, Nairobi",
      status: "Available",
      tenants: 0,
      rating: 4.5,
      views: 856,
      inquiries: 12,
      booked: null,
      type: "studio",
      earnings: "Ksh 0"
    },
    {
      id: 3,
      title: "Executive 3 Bedroom Villa",
      price: "Ksh 120,000",
      image: require("../assets/house3.jpg"),
      location: "Karen, Nairobi",
      status: "Pending",
      tenants: 0,
      rating: 4.9,
      views: 2103,
      inquiries: 45,
      booked: null,
      type: "villa",
      earnings: "Ksh 0"
    },
  ]);

  const [analytics, setAnalytics] = useState({
    totalEarnings: "Ksh 450,000",
    monthlyEarnings: "Ksh 90,000",
    activeTenants: 8,
    occupancyRate: "85%",
    properties: 12,
    performance: "+15%",
    responseRate: "98%",
    avgRating: 4.7
  });

  const scrollY = useRef(new Animated.Value(0)).current;
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });

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
    router.push("/edit-profile");
  };

  const handleQuickAction = (action: string) => {
    switch(action) {
      case 'publish':
        router.push("/publish");
        break;
      case 'manage':
        router.push("/manage-properties");
        break;
      case 'messages':
        router.push("/messages");
        break;
      case 'analytics':
        setActiveTab('analytics');
        break;
      case 'favorites':
        router.push("/favorites");
        break;
      case 'documents':
        router.push("/documents");
        break;
      case 'support':
        router.push("/support");
        break;
      default:
        Alert.alert("Coming Soon", "This feature will be available soon!");
    }
  };

  const stats = [
    { 
      label: "Total Properties", 
      value: rentals.length,
      icon: "business",
      change: "+2",
      color: "#003366"
    },
    { 
      label: "Occupancy Rate", 
      value: "85%",
      icon: "trending-up",
      change: "+5%",
      color: "#2E8B57"
    },
    { 
      label: "Monthly Revenue", 
      value: "Ksh 90K",
      icon: "cash",
      change: "+12%",
      color: "#DAA520"
    },
    {
      label: "Avg Rating",
      value: "4.7",
      icon: "star",
      change: "+0.2",
      color: "#FF6B35"
    }
  ];

  const quickActions = [
    {
      title: "Publish New",
      icon: "add-circle",
      description: "List new property",
      onPress: () => handleQuickAction('publish'),
      color: "#003366",
      gradient: ["#003366", "#0044CC"]
    },
    {
      title: "Manage",
      icon: "settings",
      description: "Properties & tenants",
      onPress: () => handleQuickAction('manage'),
      color: "#2E8B57",
      gradient: ["#2E8B57", "#32CD32"]
    },
    {
      title: "Messages",
      icon: "chatbubbles",
      description: "24 new messages",
      onPress: () => handleQuickAction('messages'),
      color: "#FF6B35",
      gradient: ["#FF6B35", "#FF8C00"]
    },
    {
      title: "Analytics",
      icon: "bar-chart",
      description: "View insights",
      onPress: () => handleQuickAction('analytics'),
      color: "#DAA520",
      gradient: ["#DAA520", "#FFD700"]
    },
    {
      title: "Favorites",
      icon: "heart",
      description: "Saved properties",
      onPress: () => handleQuickAction('favorites'),
      color: "#E91E63",
      gradient: ["#E91E63", "#FF4081"]
    },
    {
      title: "Documents",
      icon: "document-text",
      description: "Contracts & files",
      onPress: () => handleQuickAction('documents'),
      color: "#9C27B0",
      gradient: ["#9C27B0", "#E040FB"]
    }
  ];

  const renderPropertiesTab = () => (
    <View style={styles.tabContent}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Your Properties</Text>
        <View style={styles.propertyFilters}>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Available</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterButton}>
            <Text style={styles.filterText}>Occupied</Text>
          </TouchableOpacity>
        </View>
      </View>

      {rentals.map((rent) => (
        <TouchableOpacity 
          key={rent.id} 
          style={styles.rentalCard}
          onPress={() => handleRentalPress(rent)}
        >
          <Image source={rent.image} style={styles.rentalImage} />
          <View style={styles.rentalInfo}>
            <View style={styles.rentalHeader}>
              <View>
                <Text style={styles.rentalTitle}>{rent.title}</Text>
                <Text style={styles.rentalLocation}>{rent.location}</Text>
              </View>
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={14} color="#FFD700" />
                <Text style={styles.rating}>{rent.rating}</Text>
              </View>
            </View>
            
            <View style={styles.rentalStats}>
              <View style={styles.statItem}>
                <Ionicons name="eye" size={12} color="#666" />
                <Text style={styles.statText}>{rent.views} views</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="chatbubble" size={12} color="#666" />
                <Text style={styles.statText}>{rent.inquiries} inquiries</Text>
              </View>
              <View style={styles.statItem}>
                <Ionicons name="cash" size={12} color="#666" />
                <Text style={styles.statText}>{rent.earnings}</Text>
              </View>
            </View>

            <View style={styles.rentalFooter}>
              <Text style={styles.rentalPrice}>{rent.price}/month</Text>
              <View style={[
                styles.statusBadge, 
                rent.status === 'Available' ? styles.availableBadge : 
                rent.status === 'Occupied' ? styles.occupiedBadge : styles.pendingBadge
              ]}>
                <Text style={styles.statusText}>{rent.status}</Text>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAnalyticsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Performance Overview</Text>
      
      <View style={styles.analyticsGrid}>
        <View style={styles.analyticsCard}>
          <Ionicons name="trending-up" size={24} color="#2E8B57" />
          <Text style={styles.analyticsValue}>{analytics.totalEarnings}</Text>
          <Text style={styles.analyticsLabel}>Total Earnings</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Ionicons name="people" size={24} color="#003366" />
          <Text style={styles.analyticsValue}>{analytics.activeTenants}</Text>
          <Text style={styles.analyticsLabel}>Active Tenants</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Ionicons name="speedometer" size={24} color="#FF6B35" />
          <Text style={styles.analyticsValue}>{analytics.occupancyRate}</Text>
          <Text style={styles.analyticsLabel}>Occupancy Rate</Text>
        </View>
        <View style={styles.analyticsCard}>
          <Ionicons name="star" size={24} color="#DAA520" />
          <Text style={styles.analyticsValue}>{analytics.avgRating}</Text>
          <Text style={styles.analyticsLabel}>Average Rating</Text>
        </View>
      </View>

      <View style={styles.chartPlaceholder}>
        <Ionicons name="bar-chart" size={48} color="#ccc" />
        <Text style={styles.chartText}>Revenue Analytics</Text>
        <Text style={styles.chartSubtext}>Monthly performance charts</Text>
      </View>
    </View>
  );

  const renderSettingsTab = () => (
    <View style={styles.tabContent}>
      <Text style={styles.sectionTitle}>Account Settings</Text>
      
      <View style={styles.settingsList}>
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="person" size={20} color="#003366" />
          <Text style={styles.settingText}>Personal Information</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="notifications" size={20} color="#003366" />
          <Text style={styles.settingText}>Notifications</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="lock-closed" size={20} color="#003366" />
          <Text style={styles.settingText}>Privacy & Security</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="card" size={20} color="#003366" />
          <Text style={styles.settingText}>Payment Methods</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.settingItem}>
          <Ionicons name="help-circle" size={20} color="#003366" />
          <Text style={styles.settingText}>Help & Support</Text>
          <Ionicons name="chevron-forward" size={16} color="#ccc" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#003366" />
      
      {/* Animated Header */}
      <Animated.View style={[styles.animatedHeader, { opacity: headerOpacity }]}>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Ionicons name="notifications" size={22} color="#003366" />
        </TouchableOpacity>
      </Animated.View>

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        scrollEventThrottle={16}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileHeader}>
            <View style={styles.profileImageContainer}>
              <Image source={user.profilePic} style={styles.profilePic} />
              {user.verified && (
                <View style={styles.verifiedBadge}>
                  <Ionicons name="checkmark" size={12} color="white" />
                </View>
              )}
              <TouchableOpacity 
                style={styles.editProfileButton}
                onPress={handleEditProfile}
              >
                <Ionicons name="camera" size={16} color="white" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.userInfo}>
              <View style={styles.nameContainer}>
                <Text style={styles.name}>{user.name}</Text>
                {user.verified && (
                  <Ionicons name="shield-checkmark" size={16} color="#2E8B57" />
                )}
              </View>
              <Text style={styles.description}>{user.description}</Text>
              
              <View style={styles.userStats}>
                <View style={styles.userStat}>
                  <Text style={styles.userStatValue}>{user.responseRate}%</Text>
                  <Text style={styles.userStatLabel}>Response</Text>
                </View>
                <View style={styles.userStat}>
                  <Text style={styles.userStatValue}>{user.avgResponseTime}</Text>
                  <Text style={styles.userStatLabel}>Avg. Response</Text>
                </View>
                <View style={styles.userStat}>
                  <Text style={styles.userStatValue}>4.7★</Text>
                  <Text style={styles.userStatLabel}>Rating</Text>
                </View>
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
        </View>

        {/* Stats Section */}
        <View style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                <Ionicons name={stat.icon as any} size={20} color={stat.color} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
              <Text style={[styles.statChange, { color: stat.color }]}>
                {stat.change}
              </Text>
            </View>
          ))}
        </View>

        {/* Quick Actions */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          style={styles.actionsScroll}
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
              <Text style={styles.actionText}>{action.title}</Text>
              <Text style={styles.actionDescription}>{action.description}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'properties' && styles.activeTab]}
            onPress={() => setActiveTab('properties')}
          >
            <Text style={[styles.tabText, activeTab === 'properties' && styles.activeTabText]}>
              Properties
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'analytics' && styles.activeTab]}
            onPress={() => setActiveTab('analytics')}
          >
            <Text style={[styles.tabText, activeTab === 'analytics' && styles.activeTabText]}>
              Analytics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.tab, activeTab === 'settings' && styles.activeTab]}
            onPress={() => setActiveTab('settings')}
          >
            <Text style={[styles.tabText, activeTab === 'settings' && styles.activeTabText]}>
              Settings
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {activeTab === 'properties' && renderPropertiesTab()}
        {activeTab === 'analytics' && renderAnalyticsTab()}
        {activeTab === 'settings' && renderSettingsTab()}

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity 
        style={styles.fab}
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
    backgroundColor: "#f8f9fa",
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
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f4ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: "#003366",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  profileImageContainer: {
    position: 'relative',
    marginRight: 15,
  },
  profilePic: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "rgba(255,255,255,0.3)",
  },
  verifiedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#2E8B57',
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#003366',
  },
  editProfileButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#FF6B35',
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#003366',
  },
  userInfo: {
    flex: 1,
  },
  nameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginRight: 6,
  },
  description: {
    fontSize: 14,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 12,
  },
  userStats: {
    flexDirection: 'row',
    gap: 15,
  },
  userStat: {
    alignItems: 'center',
  },
  userStatValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  userStatLabel: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
  },
  contactSection: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: "rgba(255,255,255,0.9)",
    marginLeft: 8,
  },
  joinDate: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    marginLeft: 8,
    fontStyle: 'italic',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    margin: 20,
    padding: 15,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#003366',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    marginBottom: 2,
  },
  statChange: {
    fontSize: 10,
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginHorizontal: 20,
    marginBottom: 15,
    marginTop: 10,
  },
  actionsScroll: {
    paddingHorizontal: 15,
    marginBottom: 20,
  },
  actionCard: {
    width: 140,
    backgroundColor: "#003366",
    borderRadius: 16,
    padding: 15,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionDescription: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.8)',
  },
  tabContainer: {
    flexDirection: 'row',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: '#003366',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  tabContent: {
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  propertyFilters: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#f0f4ff',
    borderRadius: 8,
  },
  filterText: {
    fontSize: 12,
    color: '#003366',
    fontWeight: '500',
  },
  rentalCard: {
    flexDirection: "row",
    backgroundColor: "#ffffff",
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  rentalImage: {
    width: 80,
    height: 80,
    borderRadius: 12,
    marginRight: 12,
  },
  rentalInfo: {
    flex: 1,
  },
  rentalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  rentalTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: '#003366',
    flex: 1,
  },
  rentalLocation: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff8e1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  rating: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
    fontWeight: '600',
  },
  rentalStats: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 11,
    color: '#666',
  },
  rentalFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  rentalPrice: {
    fontSize: 16,
    color: "#DAA520",
    fontWeight: '700',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  pendingBadge: {
    backgroundColor: '#fff8e1',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  availableBadge: {
    backgroundColor: '#e8f5e8',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2e8b57',
  },
  occupiedBadge: {
    backgroundColor: '#ffe8e8',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#d32f2f',
  },
  pendingBadge: {
    backgroundColor: '#fff8e1',
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#ff8c00',
  },
  analyticsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
  },
  analyticsCard: {
    width: '47%',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  analyticsValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#003366',
    marginVertical: 8,
  },
  analyticsLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  chartPlaceholder: {
    backgroundColor: 'white',
    padding: 40,
    borderRadius: 12,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  chartText: {
    fontSize: 16,
    color: '#666',
    marginTop: 12,
    fontWeight: '600',
  },
  chartSubtext: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  settingsList: {
    backgroundColor: 'white',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  settingText: {
    flex: 1,
    fontSize: 14,
    color: '#003366',
    fontWeight: '500',
    marginLeft: 12,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FF6B35',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomSpacer: {
    height: 80,
  },
});