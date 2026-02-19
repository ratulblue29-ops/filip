import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  FlatList,
  StyleSheet,
} from 'react-native';
import { ChevronDown, Check, X } from 'lucide-react-native';

type FilterDropdownProps = {
  label: string;
  options: string[];
  selected: string | null;
  onSelect: (value: string | null) => void;
};

const FilterDropdown = ({
  label,
  options,
  selected,
  onSelect,
}: FilterDropdownProps) => {
  const [open, setOpen] = useState(false);

  const isActive = selected !== null;
  const displayLabel = selected ?? label;

  return (
    <>
      {/* Trigger Button */}
      <TouchableOpacity
        style={[s.btn, isActive && s.btnActive]}
        onPress={() => setOpen(true)}
      >
        <Text
          style={[s.btnText, isActive && s.btnTextActive]}
          numberOfLines={1}
        >
          {displayLabel}
        </Text>
        <ChevronDown size={16} color={isActive ? '#000' : '#FFF'} />
      </TouchableOpacity>

      {/* Dropdown Modal */}
      <Modal
        visible={open}
        transparent
        animationType="fade"
        onRequestClose={() => setOpen(false)}
      >
        <TouchableOpacity
          style={s.overlay}
          activeOpacity={1}
          onPress={() => setOpen(false)}
        >
          <View style={s.sheet}>
            {/* Sheet Header */}
            <View style={s.sheetHeader}>
              <Text style={s.sheetTitle}>{label}</Text>
              <TouchableOpacity onPress={() => setOpen(false)}>
                <X size={20} color="#FFF" />
              </TouchableOpacity>
            </View>

            {/* Clear Option */}
            {isActive && (
              <TouchableOpacity
                style={s.clearRow}
                onPress={() => {
                  onSelect(null);
                  setOpen(false);
                }}
              >
                <Text style={s.clearText}>Clear filter</Text>
              </TouchableOpacity>
            )}

            {/* Options List */}
            <FlatList
              data={options}
              keyExtractor={item => item}
              renderItem={({ item }) => {
                const isSelected = selected === item;
                return (
                  <TouchableOpacity
                    style={s.optionRow}
                    onPress={() => {
                      onSelect(item);
                      setOpen(false);
                    }}
                  >
                    <Text
                      style={[s.optionText, isSelected && s.optionTextActive]}
                    >
                      {item}
                    </Text>
                    {isSelected && <Check size={16} color="#FFD900" />}
                  </TouchableOpacity>
                );
              }}
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default FilterDropdown;

const s = StyleSheet.create({
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 24,
    marginRight: 12,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#2A2A2A',
    gap: 8,
    maxWidth: 140,
  },
  btnActive: {
    backgroundColor: '#FFD900',
  },
  btnText: {
    color: '#FFF',
    fontSize: 14,
    fontFamily: 'InterDisplayRegular',
    flexShrink: 1,
  },
  btnTextActive: {
    color: '#000',
    fontWeight: '600',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#1A1A1A',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 20,
    paddingBottom: 40,
    maxHeight: '60%',
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    marginBottom: 8,
  },
  sheetTitle: {
    color: '#FFF',
    fontSize: 16,
    fontFamily: 'InterDisplayMedium',
    fontWeight: '600',
  },
  clearRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#2A2A2A',
    marginBottom: 4,
  },
  clearText: {
    color: '#FF4444',
    fontSize: 14,
    fontFamily: 'InterDisplayRegular',
  },
  optionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#1E1E1E',
  },
  optionText: {
    color: '#9CA3AF',
    fontSize: 14,
    fontFamily: 'InterDisplayRegular',
  },
  optionTextActive: {
    color: '#FFD900',
    fontWeight: '600',
  },
});
