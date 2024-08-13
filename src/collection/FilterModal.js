import React, { useState } from 'react';
import { View, Modal, Button, TouchableOpacity, Text, ScrollView, StyleSheet, TextInput } from 'react-native';

const FilterModal = ({
  isVisible,
  onClose,
  filters,
  selectedFilters,
  onFilterSelect,
  onApply,
  minPrice,
  maxPrice,
}) => {
  const [visibleFilters, setVisibleFilters] = useState({});
  const [inputMinPrice, setInputMinPrice] = useState(minPrice ? minPrice.toString() : '');
  const [inputMaxPrice, setInputMaxPrice] = useState(maxPrice ? maxPrice.toString() : '');

  const toggleFilterVisibility = (filterId) => {
    setVisibleFilters((prevState) => ({
      ...prevState,
      [filterId]: !prevState[filterId],
    }));
  };

  const handleSelect = (filterId, valueLabel, filterLabel) => {
    const isSelected = selectedFilters[filterId] && selectedFilters[filterId].includes(valueLabel);
    onFilterSelect(filterId, valueLabel, filterLabel, isSelected);
  };

  const renderAppliedFilters = () => {
    return Object.keys(selectedFilters).filter(filterId => filterId !== 'filter.v.price').map(filterId => (
      selectedFilters[filterId].map(valueLabel => (
        <View key={`${filterId}-${valueLabel}`} style={styles.appliedFilter}>
          <Text style={styles.appliedFilterText}>{`${valueLabel}`}</Text>
          <TouchableOpacity onPress={() => handleSelect(filterId, valueLabel, null, true)}>
            <Text style={styles.removeFilterText}>×</Text>
          </TouchableOpacity>
        </View>
      ))
    ));
  };

  const renderFilterSection = (filter) => {
    const isFilterVisible = !!visibleFilters[filter.id];
    if (filter.id === 'filter.v.price') {
        return (
          <View key={`price-filter-${filter.id}`} style={styles.filterSection}>
            <TouchableOpacity onPress={() => toggleFilterVisibility(filter.id)}>
              <Text style={styles.filterTitle}>Price</Text>
            </TouchableOpacity>
            {isFilterVisible && (
              <View>
                <Text style={styles.label}>Minimal Price</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.textInputWithBorder}
                    onChangeText={setInputMinPrice}
                    value={inputMinPrice}
                    placeholder={`0`}
                    keyboardType="numeric"
                  />
                </View>
                <Text style={styles.label}>Maximal Price</Text>
                <View style={styles.inputRow}>
                  <TextInput
                    style={styles.textInputWithBorder}
                    onChangeText={setInputMaxPrice}
                    value={inputMaxPrice}
                    placeholder={`Max. price - ${maxPrice ? maxPrice.toString() : 'not set'}`}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            )}
          </View>
        );
    }

    return (
      <View key={filter.id} style={styles.filterSection}>
        <TouchableOpacity onPress={() => toggleFilterVisibility(filter.id)}>
          <Text style={styles.filterTitle}>{filter.label}</Text>
        </TouchableOpacity>
        {isFilterVisible && filter.values.map((value, index) => (
          <TouchableOpacity
            key={`${filter.id}-${value.id}-${index}`}
            onPress={() => handleSelect(filter.id, value.label, filter.label)}
            style={[
              styles.filterOption,
              isSelected(filter.id, value.label) ? styles.selectedFilterOption : styles.unselectedFilterOption,
            ]}
          >
            <Text style={styles.filterOptionText}>{value.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  function isSelected(filterId, valueLabel) {
    return selectedFilters[filterId] && selectedFilters[filterId].includes(valueLabel);
  }

  return (
    <Modal visible={isVisible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalContent}>
        <Button title="Close" onPress={onClose} />
        <View style={styles.appliedFiltersContainer}>
          {renderAppliedFilters()}
        </View>
        <ScrollView>{filters.map(renderFilterSection)}</ScrollView>
        <Button title="Apply Filters" onPress={() => onApply(inputMinPrice, inputMaxPrice)} />
      </View>
    </Modal>
  );
};

// Styles remain unchanged

const styles = StyleSheet.create({
    modalContent: {
        flex: 1,
        backgroundColor: 'white',
        borderRadius: 4,
        padding: 16,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    filterSection: {
        marginBottom: 20,
    },
    filterTitle: {
        fontWeight: 'bold',
        fontSize: 16,
        marginVertical: 10,
    },
    filterOption: {
        padding: 10,
        borderRadius: 4,
        marginVertical: 5,
        borderWidth: 1,
        borderColor: '#ddd',
    },
    selectedFilterOption: {
        backgroundColor: '#007bff',
    },
    unselectedFilterOption: {
        backgroundColor: '#ffffff',
    },
    filterOptionText: {
        textAlign: 'center',
    },
    label: {
        fontWeight: 'bold',
        marginTop: 10,
      },
      inputRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
      },
      textInputWithBorder: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        flex: 1,
      },
    appliedFiltersContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        paddingVertical: 10,
    },
    appliedFilter: {
        flexDirection: 'row',
        backgroundColor: '#e1e1e1',
        borderRadius: 20,
        padding: 8,
        margin: 4,
        alignItems: 'center',
    },
    appliedFilterText: {
        marginRight: 6,
    },
    removeFilterText: {
        color: '#ff0000',
    },
});

export default FilterModal;
