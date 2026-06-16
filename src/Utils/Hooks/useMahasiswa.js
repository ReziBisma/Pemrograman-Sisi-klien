import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllMahasiswa,
  storeMahasiswa,
  updateMahasiswa,
  deleteMahasiswa,
} from "@/Utils/Apis/MahasiswaApi";
import { toastSuccess, toastError } from "@/Utils/Helpers/ToastHelpers";

export const useMahasiswa = (query = {}) =>
  useQuery({
    queryKey: ["mahasiswa", query],

    queryFn: async () => {
      const res = await getAllMahasiswa();

      let data = res.data || [];

      // SEARCH
      if (query.q) {
        const keyword = query.q.toLowerCase();

        data = data.filter(
          (m) =>
            m.name?.toLowerCase().includes(keyword) ||
            m.nim?.toLowerCase().includes(keyword)
        );
      }

      // SORT
      if (query._sort) {
        data.sort((a, b) => {
          const aValue = a[query._sort];
          const bValue = b[query._sort];

          if (query._order === "desc") {
            return aValue > bValue ? -1 : 1;
          }

          return aValue > bValue ? 1 : -1;
        });
      }

      const total = data.length;

      // PAGINATION
      const page = query._page || 1;
      const limit = query._limit || 5;

      const start = (page - 1) * limit;
      const end = start + limit;

      data = data.slice(start, end);

      return {
        data,
        total,
      };
    },

    keepPreviousData: true,
  });

export const useStoreMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: storeMahasiswa,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });

      toastSuccess("Mahasiswa berhasil ditambahkan!");
    },
    onError: () => {
      toastError("Gagal menambahkan mahasiswa.");
    },
  });
};

export const useUpdateMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateMahasiswa(id, data),

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });

      toastSuccess("Mahasiswa berhasil diperbarui!");
    },

    onError: () => {
      toastError("Gagal memperbarui mahasiswa.");
    },
  });
};

export const useDeleteMahasiswa = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteMahasiswa,

    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: ["mahasiswa"],
      });

      toastSuccess("Mahasiswa berhasil dihapus!");
    },

    onError: () => {
      toastError("Gagal menghapus mahasiswa.");
    },
  });
};