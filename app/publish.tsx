// app/publish.tsx
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

export default function Publish() {
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    location: "",
    bedrooms: "",
    bathrooms: "",
    size: "",
    amenities: ""
  });
  const [images, setImages] = useState<string[]>([]);
  const [video, setVideo] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  // Request media permissions
  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need media library permissions to make this work!');
      return false;
    }
    return true;
  };

  // Handle input changes
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  // Pick images
  const pickImages = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.8,
      allowsEditing: false,
      selectionLimit: 10 - images.length,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
  };

  // Pick video
  const pickVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      quality: 0.8,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets) {
      setVideo(result.assets[0].uri);
    }
  };

  // Remove video
  const removeVideo = () => {
    setVideo(null);
  };

  // Take photo with camera
  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission required', 'Sorry, we need camera permissions to take photos!');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: false,
    });

    if (!result.canceled && result.assets) {
      const newImages = result.assets.map((asset) => asset.uri);
      setImages([...images, ...newImages]);
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.title.trim()) {
      newErrors.title = "Property title is required";
    }

    if (!formData.price.trim()) {
      newErrors.price = "Price is required";
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = "Please enter a valid price amount";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 20) {
      newErrors.description = "Description should be at least 20 characters";
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (images.length === 0) {
      newErrors.images = "At least one image is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePublish = async () => {
    if (!validateForm()) {
      Alert.alert("Validation Error", "Please fix the errors in the form");
      return;
    }

    setIsLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        "Success! 🎉",
        "Your rental property has been published successfully!",
        [
          {
            text: "View Profile",
            onPress: () => {
              resetForm();
              router.push("/(tabs)/profile");
            }
          },
          {
            text: "Add Another",
            style: "cancel",
            onPress: () => resetForm()
          }
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to publish rental. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      price: "",
      description: "",
      location: "",
      bedrooms: "",
      bathrooms: "",
      size: "",
      amenities: ""
    });
    setImages([]);
    setVideo(null);
    setErrors({});
  };

  const isFormValid = formData.title.trim() && 
                     formData.price.trim() && 
                     formData.description.trim() && 
                     formData.location.trim() && 
                     images.length > 0;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="arrow-back" size={24} color="#003366" />
        </TouchableOpacity>
        <Text style={styles.title}>Publish New Rental</Text>
        <View style={{ width: 24 }} />
      </View>

      <Text style={styles.subtitle}>Fill in the details of your rental property</Text>

      {/* Basic Information */}
      <Text style={styles.sectionTitle}>Basic Information</Text>
      
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Property Title *"
          value={formData.title}
          onChangeText={(value) => handleInputChange('title', value)}
          style={[styles.input, errors.title && styles.inputError]}
          placeholderTextColor="#999"
        />
        {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}
      </View>

      <View style={styles.row}>
        <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
          <TextInput
            placeholder="Price (Ksh) *"
            value={formData.price}
            onChangeText={(value) => handleInputChange('price', value)}
            keyboardType="numeric"
            style={[styles.input, errors.price && styles.inputError]}
            placeholderTextColor="#999"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>
        <View style={[styles.inputContainer, { flex: 1 }]}>
          <TextInput
            placeholder="Location *"
            value={formData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            style={[styles.input, errors.location && styles.inputError]}
            placeholderTextColor="#999"
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}
        </View>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Description *"
          value={formData.description}
          onChangeText={(value) => handleInputChange('description', value)}
          style={[styles.input, styles.textArea, errors.description && styles.inputError]}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
        {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
      </View>

      {/* Property Details */}
      <Text style={styles.sectionTitle}>Property Details</Text>
      
      <View style={styles.row}>
        <TextInput
          placeholder="Bedrooms"
          value={formData.bedrooms}
          onChangeText={(value) => handleInputChange('bedrooms', value)}
          keyboardType="numeric"
          style={[styles.input, { flex: 1, marginRight: 10 }]}
          placeholderTextColor="#999"
        />
        <TextInput
          placeholder="Bathrooms"
          value={formData.bathrooms}
          onChangeText={(value) => handleInputChange('bathrooms', value)}
          keyboardType="numeric"
          style={[styles.input, { flex: 1 }]}
          placeholderTextColor="#999"
        />
      </View>

      <TextInput
        placeholder="Size (sq ft)"
        value={formData.size}
        onChangeText={(value) => handleInputChange('size', value)}
        keyboardType="numeric"
        style={styles.input}
        placeholderTextColor="#999"
      />

      <TextInput
        placeholder="Amenities (comma separated) e.g., WiFi, Parking, Security"
        value={formData.amenities}
        onChangeText={(value) => handleInputChange('amenities', value)}
        style={styles.input}
        placeholderTextColor="#999"
      />

      {/* Media Upload */}
      <Text style={styles.sectionTitle}>Media</Text>
      
      <Text style={styles.subtitle}>Images ({images.length}/10)</Text>
      {errors.images && <Text style={styles.errorText}>{errors.images}</Text>}
      
      <View style={styles.mediaButtons}>
        <TouchableOpacity style={styles.mediaButton} onPress={pickImages}>
          <Ionicons name="images-outline" size={20} color="#0033A0" />
          <Text style={styles.mediaButtonText}>Gallery</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.mediaButton} onPress={takePhoto}>
          <Ionicons name="camera-outline" size={20} color="#0033A0" />
          <Text style={styles.mediaButtonText}>Camera</Text>
        </TouchableOpacity>
      </View>

      {/* Image Preview */}
      {images.length > 0 && (
        <View style={styles.imagesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {images.map((img, index) => (
              <View key={index} style={styles.imageWrapper}>
                <Image source={{ uri: img }} style={styles.previewImg} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => removeImage(index)}
                >
                  <Ionicons name="close-circle" size={20} color="#ff4444" />
                </TouchableOpacity>
                <Text style={styles.imageNumber}>{index + 1}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Video Upload */}
      <Text style={styles.subtitle}>Video Tour (Optional)</Text>
      <TouchableOpacity 
        style={[styles.uploadButton, video && styles.uploadButtonSuccess]} 
        onPress={video ? removeVideo : pickVideo}
      >
        <Ionicons 
          name={video ? "checkmark-circle" : "videocam-outline"} 
          size={24} 
          color={video ? "#2e8b57" : "#fff"} 
        />
        <Text style={[styles.uploadText, video && styles.uploadTextSuccess]}>
          {video ? "Video Selected (Tap to remove)" : "Upload Video Tour"}
        </Text>
      </TouchableOpacity>

      {/* Tips */}
      <View style={styles.tipsContainer}>
        <Text style={styles.tipsTitle}>💡 Tips for Better Listings</Text>
        <Text style={styles.tip}>• Use clear, well-lit photos</Text>
        <Text style={styles.tip}>• Show all rooms and amenities</Text>
        <Text style={styles.tip}>• Write a detailed description</Text>
        <Text style={styles.tip}>• Set a competitive price</Text>
      </View>

      {/* Publish Button */}
      <TouchableOpacity 
        style={[
          styles.publishButton, 
          (!isFormValid || isLoading) && styles.publishButtonDisabled
        ]} 
        onPress={handlePublish}
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <>
            <Ionicons name="cloud-upload-outline" size={20} color="white" />
            <Text style={styles.publishText}>
              {isFormValid ? "Publish Rental" : "Fill All Required Fields"}
            </Text>
          </>
        )}
      </TouchableOpacity>

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#ffffff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  backButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f4ff",
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#003366",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#003366",
    marginBottom: 15,
    marginTop: 10,
  },
  inputContainer: {
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    fontSize: 16,
  },
  inputError: {
    borderColor: "#ff4444",
    backgroundColor: "#fff5f5",
  },
  errorText: {
    color: "#ff4444",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 5,
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  mediaButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  mediaButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 10,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#0033A0",
  },
  mediaButtonText: {
    color: "#0033A0",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
  },
  imagesSection: {
    marginBottom: 20,
  },
  imageWrapper: {
    position: 'relative',
    marginRight: 10,
  },
  previewImg: {
    width: 100,
    height: 100,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  removeImageButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  imageNumber: {
    position: 'absolute',
    bottom: 5,
    left: 5,
    backgroundColor: 'rgba(0,0,0,0.7)',
    color: 'white',
    fontSize: 10,
    paddingHorizontal: 4,
    borderRadius: 4,
  },
  uploadButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0033A0",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  uploadButtonSuccess: {
    backgroundColor: "#e8f5e8",
    borderWidth: 1,
    borderColor: "#2e8b57",
  },
  uploadText: {
    color: "white",
    fontWeight: "600",
    marginLeft: 8,
    fontSize: 14,
    textAlign: 'center',
  },
  uploadTextSuccess: {
    color: "#2e8b57",
  },
  tipsContainer: {
    backgroundColor: "#f0f8ff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: "#0033A0",
  },
  tipsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
  },
  tip: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  publishButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0033A0",
    padding: 18,
    borderRadius: 12,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  publishButtonDisabled: {
    backgroundColor: "#ccc",
  },
  publishText: {
    color: "white",
    fontSize: 16,
    fontWeight: "700",
    marginLeft: 8,
  },
});