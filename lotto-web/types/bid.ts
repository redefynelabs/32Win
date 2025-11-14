interface BidData {
    id: string;
    customer_name: string;
    customer_phone: string;
    bid_number: number;
    bid_count: number;
    date: string;
    time: string;
}

interface JackpotBidData {
    id: string;
    customer_name: string;
    customer_phone: string;
    bid_numbers: number[]; 
    bid_count: number;
    date: string;
    time: string;
}



interface JackpotBidCartProps {
  filteredBids: JackpotBidData[];
  editingBid: string | null;
  totalAmount: number;
  handleEdit: (bid: any) => void;
  handleDelete: (id: string) => void;
}


interface LuckyDrawBidCartProps {
  filteredBids: BidData[];
  editingBid: string | null;
  totalAmount: number;
  handleEdit: (bid: any) => void;
  handleDelete: (id: string) => void;
}
