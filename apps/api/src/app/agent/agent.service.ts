import {Injectable, OnModuleInit} from '@nestjs/common';
import {PrismaService} from "../prisma.service";

@Injectable()
export class AgentService {
  constructor(private readonly prismaService: PrismaService) {}

  async fetchAgents() {
    try {
      const hugoJSON = await this.prismaService.agent.findMany();
      return hugoJSON.map((entry) => entry.agent);
    } catch (error) {
      console.error('Error fetching', error);
      throw error;
    }
  }

  async filterAgent(query: string) {

    if (query === undefined || query === '') {
      return [];
    }

    try {
      const symbols = await this.fetchAgents();
      const filteredAgents = symbols.filter((symbol) =>
        symbol.toLowerCase().startsWith(query?.toLowerCase())
      );
      return filteredAgents;
    } catch (error) {
      console.error('Error filtering', error);
      throw error;
    }
  }

}
