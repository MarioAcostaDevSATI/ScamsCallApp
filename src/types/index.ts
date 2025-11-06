export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ciudadano' | 'agente';
  institution?: string;
  createdAt: Date;
}

export interface Report {
  id: string;
  phoneNumber: string;
  reportType: 'extorsion' | 'phishing' | 'fraude' | 'acoso' | 'otros';
  description: string;
  timestamp: Date;
  reporterId: string;
  status: 'pendiente' | 'verificado' | 'falso';
  evidence?: string;
  location?: string;
}

export interface SearchFilters {
  phoneNumber?: string;
  reportType?: string;
  dateFrom?: Date;
  dateTo?: Date;
  status?: string;
}
