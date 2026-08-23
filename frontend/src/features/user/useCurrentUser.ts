import { useCallback, useState } from 'react'
import { ApiError } from '../../api/client'
import { changePassword, upsertAddress } from '../../api/auth'
import { updateUser } from '../../api/users'
import type { AddressInput, UpdateUserInput } from '../../types/user'
import { useSession } from '../auth/SessionProvider'

type FormStatus = {
  saving: boolean
  error: string | null
  message: string | null
}

const idle: FormStatus = { saving: false, error: null, message: null }

export function useCurrentUser() {
  const session = useSession()
  const [personal, setPersonal] = useState<FormStatus>(idle)
  const [address, setAddress] = useState<FormStatus>(idle)
  const [password, setPassword] = useState<FormStatus>(idle)

  const user = session.user

  const updateProfile = useCallback(
    async (payload: UpdateUserInput) => {
      if (!user) {
        return false
      }

      setPersonal({ saving: true, error: null, message: null })

      try {
        const next = await updateUser(user.id, payload)
        session.save(next)
        setPersonal({
          saving: false,
          error: null,
          message: 'Dados pessoais atualizados.',
        })
        return true
      } catch (err) {
        let error = 'Não foi possível salvar. Confira se a API está no ar.'
        if (err instanceof ApiError && err.status === 409) {
          error = 'E-mail ou CPF já está em uso.'
        } else if (err instanceof ApiError && err.status === 401) {
          error = 'Sessão expirada. Entre novamente.'
        } else if (err instanceof ApiError && err.status === 400) {
          error = 'Confira nome, e-mail e CPF (11 dígitos).'
        }
        setPersonal({ saving: false, error, message: null })
        return false
      }
    },
    [session, user],
  )

  const updateAddress = useCallback(
    async (payload: AddressInput) => {
      setAddress({ saving: true, error: null, message: null })

      try {
        const next = await upsertAddress(payload)
        session.save(next)
        setAddress({
          saving: false,
          error: null,
          message: 'Endereço atualizado.',
        })
        return true
      } catch (err) {
        let error = 'Não foi possível salvar o endereço.'
        if (err instanceof ApiError && err.status === 401) {
          error = 'Sessão expirada. Entre novamente.'
        } else if (err instanceof ApiError && err.status === 400) {
          error = 'Confira rua, CEP, número, cidade e UF.'
        }
        setAddress({ saving: false, error, message: null })
        return false
      }
    },
    [session],
  )

  const updatePassword = useCallback(
    async (currentPassword: string, newPassword: string) => {
      setPassword({ saving: true, error: null, message: null })

      try {
        await changePassword({ currentPassword, newPassword })
        setPassword({
          saving: false,
          error: null,
          message: 'Senha atualizada.',
        })
        return true
      } catch (err) {
        let error = 'Não foi possível atualizar a senha.'
        if (err instanceof ApiError && err.status === 401) {
          error = 'Senha atual incorreta.'
        } else if (err instanceof ApiError && err.status === 400) {
          error =
            'A nova senha precisa ter 8–72 caracteres, com letra e número, e ser diferente da atual.'
        }
        setPassword({ saving: false, error, message: null })
        return false
      }
    },
    [],
  )

  const clear = useCallback(async () => {
    await session.clear()
  }, [session])

  return {
    user,
    loading: session.loading,
    personalStatus: personal,
    addressStatus: address,
    passwordStatus: password,
    updateProfile,
    updateAddress,
    updatePassword,
    clear,
  }
}
