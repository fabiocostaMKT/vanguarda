import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate, useParams, Link } from 'react-router-dom'
import { ArrowLeft, Save } from 'lucide-react'
import { repo } from '../../data/repo'
import { Button, Card, CardTitle, Field, Input, Select, Spinner } from '../../components/ui'

export default function AlunoForm() {
  const { id } = useParams()
  const editando = Boolean(id)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(editando)
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: { turno: 'manha', status: 'ativo', diaVencimento: 5 },
  })

  useEffect(() => {
    if (!editando) return
    repo.getAluno(id).then((a) => {
      if (a) reset({ ...a, alergias: (a.saude?.alergias || []).join(', '), tipoSanguineo: a.saude?.tipoSanguineo || '' })
      setLoading(false)
    })
  }, [id, editando, reset])

  async function onSubmit(form) {
    const aluno = {
      ...(editando ? { id } : {}),
      nome: form.nome, dataNascimento: form.dataNascimento, escola: form.escola, serie: form.serie,
      turno: form.turno, bairro: form.bairro, pontoReferencia: form.pontoReferencia || '',
      mensalidade: Number(form.mensalidade), diaVencimento: Number(form.diaVencimento), status: form.status,
      saude: {
        tipoSanguineo: form.tipoSanguineo || '',
        alergias: form.alergias ? form.alergias.split(',').map((s) => s.trim()).filter(Boolean) : [],
        medicamentos: [],
      },
      contatoEmergencia: { nome: form.emNome, parentesco: form.emParentesco, telefone: form.emTelefone },
    }
    await repo.saveAluno(aluno)
    navigate('/alunos')
  }

  if (loading) return <div className="grid h-64 place-items-center"><Spinner className="h-7 w-7" /></div>

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Link to="/alunos" className="inline-flex items-center gap-1 text-sm font-medium text-brand-600">
        <ArrowLeft className="h-4 w-4" /> Alunos
      </Link>
      <h1 className="text-2xl font-bold">{editando ? 'Editar aluno' : 'Novo aluno'}</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card className="space-y-4">
          <CardTitle>Dados básicos</CardTitle>
          <Field label="Nome completo" required error={errors.nome && 'Obrigatório'}>
            <Input {...register('nome', { required: true })} placeholder="Nome do aluno" />
          </Field>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Data de nascimento"><Input type="date" {...register('dataNascimento')} /></Field>
            <Field label="Turno" required>
              <Select {...register('turno')}><option value="manha">Manhã</option><option value="tarde">Tarde</option></Select>
            </Field>
            <Field label="Escola" required error={errors.escola && 'Obrigatório'}>
              <Input {...register('escola', { required: true })} placeholder="Nome da escola" />
            </Field>
            <Field label="Série/Ano" required error={errors.serie && 'Obrigatório'}>
              <Input {...register('serie', { required: true })} placeholder="Ex: 5º ano" />
            </Field>
            <Field label="Bairro" required error={errors.bairro && 'Obrigatório'}>
              <Input {...register('bairro', { required: true })} placeholder="Bairro" />
            </Field>
            <Field label="Ponto de referência"><Input {...register('pontoReferencia')} placeholder="Opcional" /></Field>
          </div>
        </Card>

        <Card className="space-y-4">
          <CardTitle>Financeiro</CardTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Mensalidade (R$)" required error={errors.mensalidade && 'Obrigatório'}>
              <Input type="number" step="0.01" {...register('mensalidade', { required: true })} placeholder="380" />
            </Field>
            <Field label="Dia de vencimento" required>
              <Input type="number" min="1" max="31" {...register('diaVencimento', { required: true })} />
            </Field>
            <Field label="Status">
              <Select {...register('status')}>
                <option value="ativo">Ativo</option><option value="ferias">Férias</option><option value="inativo">Inativo</option>
              </Select>
            </Field>
          </div>
        </Card>

        <Card className="space-y-4">
          <CardTitle>Saúde & Emergência</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Tipo sanguíneo">
              <Select {...register('tipoSanguineo')}>
                <option value="">—</option>
                {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
            </Field>
            <Field label="Alergias" hint="Separe por vírgula"><Input {...register('alergias')} placeholder="Ex: amendoim, poeira" /></Field>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <Field label="Contato emergência — nome" required error={errors.emNome && 'Obrigatório'}>
              <Input {...register('emNome', { required: true })} />
            </Field>
            <Field label="Parentesco"><Input {...register('emParentesco')} placeholder="Mãe, Pai…" /></Field>
            <Field label="Telefone" required error={errors.emTelefone && 'Obrigatório'}>
              <Input {...register('emTelefone', { required: true })} placeholder="(32) 9…" />
            </Field>
          </div>
        </Card>

        <div className="flex justify-end gap-3">
          <Link to="/alunos"><Button variant="ghost" type="button">Cancelar</Button></Link>
          <Button type="submit" loading={isSubmitting}><Save className="h-4 w-4" /> Salvar</Button>
        </div>
      </form>
    </div>
  )
}
