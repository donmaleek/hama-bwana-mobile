// app/(tabs)/_layout.tsx - Enhanced with FAB style
import { Ionicons } from "@expo/vector-icons";
import { Tabs, router } from "expo-router";
import { Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const TabBadge = ({ count }: { count: number }) => (
  <View style={styles.badge}>
    <Text style={styles.badgeText}>{count > 9 ? '9+' : count}</Text>
  </View>
);

export default function TabLayout() {
  const tabBadges = {
    index: 0,
    explore: 5,
    featured: 3,
    map: 0,
    profile: 2,
  };

  return (
    <View style={styles.container}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#0033A0",
          tabBarInactiveTintColor: "#666",
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          tabBarHideOnKeyboard: true,
        }}
      >
        <Tabs.Screen 
          name="index" 
          options={{
            title: "Home",
            tabBarIcon: ({ focused, color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={focused ? "home" : "home-outline"} 
                  size={size} 
                  color={color} 
                />
                {tabBadges.index > 0 && <TabBadge count={tabBadges.index} />}
              </View>
            ),
          }}
        />
        
        <Tabs.Screen 
          name="explore" 
          options={{
            title: "Explore",
            tabBarIcon: ({ focused, color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={focused ? "compass" : "compass-outline"} 
                  size={size} 
                  color={color} 
                />
                {tabBadges.explore > 0 && <TabBadge count={tabBadges.explore} />}
              </View>
            ),
          }}
        />
        
        {/* Hidden screen for publish - we'll use a FAB instead */}
        <Tabs.Screen 
          name="publish" 
          options={{
            href: null, // This hides it from the tab bar
          }}
        />
        
        <Tabs.Screen 
          name="featured" 
          options={{
            title: "Featured",
            tabBarIcon: ({ focused, color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={focused ? "star" : "star-outline"} 
                  size={size} 
                  color={color} 
                />
                {tabBadges.featured > 0 && <TabBadge count={tabBadges.featured} />}
              </View>
            ),
          }}
        />
        
        <Tabs.Screen 
          name="map" 
          options={{
            title: "Map",
            tabBarIcon: ({ focused, color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={focused ? "map" : "map-outline"} 
                  size={size} 
                  color={color} 
                />
                {tabBadges.map > 0 && <TabBadge count={tabBadges.map} />}
              </View>
            ),
          }}
        />
        
        <Tabs.Screen 
          name="profile" 
          options={{
            title: "Profile",
            tabBarIcon: ({ focused, color, size }) => (
              <View style={styles.iconContainer}>
                <Ionicons 
                  name={focused ? "person" : "person-outline"} 
                  size={size} 
                  color={color} 
                />
                {tabBadges.profile > 0 && <TabBadge count={tabBadges.profile} />}
              </View>
            ),
          }}
        />
      </Tabs>

      {/* Floating Action Button for Publish */}
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
  },
  tabBar: {
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    height: Platform.OS === 'ios' ? 90 : 70,
    paddingBottom: Platform.OS === 'ios' ? 30 : 10,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  tabBarLabel: {
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
  },
  iconContainer: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    right: -6,
    top: -3,
    backgroundColor: '#FF4444',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 80,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#0033A0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
  },
});