import TourDetails from '../components/TourDetails/TourDetails';
import { tours } from '../../data/tours';

export default function TourDetailsPage() {
  // Use the first tour as an example for the static tour-details page
  const exampleTour = tours[0];
  
  return (
    <div>
      <TourDetails tour={exampleTour} />
    </div>
  );
} 