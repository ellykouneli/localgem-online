import { MapPin, Star } from "lucide-react";

export type HiddenGem = {
  id?: string | number;
  name: string;
  description: string;
  district: string;
  imageUrl: string;
  rating?: number;
};

export default function HiddenGemCard({ gem }: { gem: HiddenGem }) {
  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden cursor-pointer hover:bg-gray-100 transition-colors shadow-card">
      <img
        src={gem.imageUrl}
        alt={gem.name}
        className="w-full h-36 object-cover"
      />
      <div className="p-3">
        <h4 className="font-medium text-gray-900 text-sm mb-1">{gem.name}</h4>
        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{gem.description}</p>
        <div className="flex items-center justify-between text-xs">
          <span className="flex items-center text-gray-500">
            <MapPin className="w-3 h-3 mr-1" />
            <span>{gem.district}</span>
          </span>
          {typeof gem.rating !== "undefined" ? (
            <span className="flex items-center text-yellow-500">
              <Star className="w-3 h-3 mr-1" />
              <span>{gem.rating}</span>
            </span>
          ) : <span />}
        </div>
      </div>
    </div>
  );
}
