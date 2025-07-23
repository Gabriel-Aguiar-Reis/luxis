import { useMutation, useQuery } from '@tanstack/react-query'
import { useAuthStore } from '@/stores/use-auth-store'
import {
  useSettingsStore,
  AppearanceSettings
} from '@/stores/use-settings-store'
import { UpdateUser, User } from '@/lib/api-types'
import { apiFetch } from '@/lib/api-client'
import { apiPaths } from '@/lib/api-paths'
import { toast } from 'sonner'

type updateUserReturn =
  UpdateUser['responses']['200']['content']['application/json']
type updateUserDto = UpdateUser['requestBody']['content']['application/json']

const userMapper = (user: User) => {
  const data = {
    name: user.name.value,
    surname: user.surname.value,
    phone: user.phone.value,
    email: user.email.value,
    street: user.residence.address.street,
    number: user.residence.address.number,
    complement: user.residence.address.complement,
    neighborhood: user.residence.address.neighborhood,
    city: user.residence.address.city,
    federativeUnit: user.residence.address.federativeUnit,
    postalCode: user.residence.address.postalCode.value,
    country: user.residence.address.country
  }
  return data
}

const userId = useAuthStore.getState().user?.id
if (!userId) {
  throw new Error('User ID is not available')
}

const fetchProfile = async () => {
  return apiFetch<User>(`${apiPaths.users.byId(userId)}`, {}, true)
}

const updateProfile = async (data: updateUserDto) => {
  return apiFetch<updateUserReturn>(
    apiPaths.users.byId(userId),
    {
      body: JSON.stringify(data)
    },
    true,
    'PATCH'
  )
}

export function useProfile() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const updateUser = useAuthStore((state) => state.updateUser)

  return useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    enabled: isAuthenticated,
    select: (data) => {
      const user = userMapper(data)
      updateUser(user)
      return user
    }
  })
}

export function useUpdateProfile() {
  const updateUser = useAuthStore((state) => state.updateUser)

  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (data) => {
      const user = userMapper(data)
      updateUser(user)
    }
  })
}

export function useUpdateAppearance() {
  const updateAppearanceSettings = useSettingsStore(
    (state) => state.updateAppearance
  )

  return useMutation({
    mutationFn: async (data: Partial<AppearanceSettings>) => {
      await updateAppearanceSettings(data)
      return data
    },
    onSuccess: (data) => {
      toast.success('Configurações de aparência atualizadas com sucesso')
    }
  })
}
