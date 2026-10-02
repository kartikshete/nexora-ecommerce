import React from 'react';
import { MapPin, Edit2, Trash2, Star } from 'lucide-react';

const AddressCard = ({ address, onEdit, onDelete, onSetDefault }) => {
  return (
    <div className={`relative p-4 rounded-xl border transition-all ${
      address.isDefault
        ? 'border-zinc-900 dark:border-white bg-zinc-50 dark:bg-zinc-800/50'
        : 'border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900'
    }`}>
      {/* Default Badge */}
      {address.isDefault && (
        <span className="absolute top-3 right-3 inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 text-[10px] font-bold">
          <Star className="w-3 h-3" />
          <span>Default</span>
        </span>
      )}

      {/* Address Content */}
      <div className="flex items-start space-x-3">
        <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-zinc-700 flex items-center justify-center flex-shrink-0 mt-0.5">
          <MapPin className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 dark:text-white">{address.fullName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{address.phone}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
            {address.addressLine}, {address.city}, {address.state} - {address.pincode}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{address.country}</p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100 dark:border-zinc-800">
        <button
          onClick={() => onEdit(address)}
          className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800"
        >
          <Edit2 className="w-3 h-3" />
          <span>Edit</span>
        </button>
        <button
          onClick={() => onDelete(address._id)}
          className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors px-2 py-1 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="w-3 h-3" />
          <span>Delete</span>
        </button>
        {!address.isDefault && (
          <button
            onClick={() => onSetDefault(address._id)}
            className="flex items-center space-x-1 text-xs font-medium text-gray-600 dark:text-gray-400 hover:text-zinc-900 dark:hover:text-white transition-colors px-2 py-1 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800 ml-auto"
          >
            <Star className="w-3 h-3" />
            <span>Set Default</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default AddressCard;
