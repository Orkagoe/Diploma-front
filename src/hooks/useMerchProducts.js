import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import http from '../shared/api/http';

export const useProducts = () => {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['merch', 'products'],
    queryFn: async () => {
      const res = await http.get('/api/merch/products');
      return res.data;
    }
  });

  const createOrder = useMutation({
    mutationFn: async ({ username, productId, qty }) => {
      const res = await http.post('/api/merch/orders?username=' + encodeURIComponent(username), { productId, qty });
      return res.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['merch', 'products'] })
  });

  return { ...q, createOrder: createOrder.mutateAsync, orderStatus: createOrder.status, orderError: createOrder.error };
};
